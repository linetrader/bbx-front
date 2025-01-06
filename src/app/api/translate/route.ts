// src/app/api/translate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { translateText } from "@/utils/TranslateModule/translateText";
import { updateMemoryCache } from "@/utils/TranslateModule/translateCache";

type TranslationCache = Record<string, string>;

const writeQueue: Record<string, Promise<void>> = {};
const MAX_CACHE_SIZE = 100000; // 최대 캐시 항목 수

const getTranslationFilePath = (language: string): string =>
  path.resolve(process.cwd(), `translations-${language}.json`);

// JSON 유효성 확인
const isValidJSON = (data: string) => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

// JSON 파일에서 번역 데이터 로드
const loadTranslationCache = async (
  language: string
): Promise<TranslationCache> => {
  const filePath = getTranslationFilePath(language);

  try {
    await fs.access(filePath); // 파일 접근 가능 여부 확인
    const data = await fs.readFile(filePath, "utf-8");

    if (!isValidJSON(data)) {
      console.warn(
        `[WARN] Invalid JSON in file for language '${language}'. Returning empty cache.`
      );
      return {};
    }

    const parsedData = JSON.parse(data) as TranslationCache;

    return parsedData;
  } catch (error) {
    console.warn(
      `[WARN] Translation file for language '${language}' not found. Using empty cache.`
    );
    return {}; // 파일이 없으면 빈 캐시 반환
  }
};

// 오래된 데이터 제거
const trimCache = (cache: TranslationCache) => {
  const keys = Object.keys(cache);
  if (keys.length > MAX_CACHE_SIZE) {
    const trimmedKeys = keys.slice(0, keys.length - MAX_CACHE_SIZE);
    trimmedKeys.forEach((key) => delete cache[key]);
    //console.log(`[DEBUG] Trimmed ${trimmedKeys.length} entries from the cache.`);
  }
};

// JSON 파일에 번역 데이터 저장
const saveTranslationCache = async (
  language: string,
  cache: TranslationCache
) => {
  const filePath = getTranslationFilePath(language);

  if (!writeQueue[language]) {
    writeQueue[language] = Promise.resolve();
  }

  writeQueue[language] = writeQueue[language].then(async () => {
    try {
      trimCache(cache); // 오래된 데이터 제거

      const jsonString = JSON.stringify(cache, null, 2);
      if (!isValidJSON(jsonString)) {
        throw new Error("Invalid JSON format");
      }

      await fs.writeFile(filePath, jsonString, "utf-8");
      //console.log(`[DEBUG] Translation cache for '${language}' saved successfully to file.`);
    } catch (error) {
      console.error(
        `[ERROR] Failed to save translations for '${language}':`,
        error
      );
    }
  });

  return writeQueue[language];
};

// API 라우트 핸들러
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language } = body;

    if (!text || !language) {
      console.error("[ERROR] Missing 'text' or 'language' in request body.");
      return NextResponse.json(
        { error: "Missing 'text' or 'language' in request body" },
        { status: 400 }
      );
    }

    const cacheKey = text; // 언어별로 파일이 나뉘므로 언어를 키에서 제외

    // JSON 파일에서 데이터 로드
    const translationCache = await loadTranslationCache(language);
    if (translationCache[cacheKey]) {
      await updateMemoryCache(language, cacheKey, translationCache[cacheKey]);
      return NextResponse.json({ translation: translationCache[cacheKey] });
    }

    // 캐시에 없는 경우 번역 API 호출
    const translated = await translateText(text, language);

    // 캐시에 추가하고 저장
    translationCache[cacheKey] = translated;
    await saveTranslationCache(language, translationCache);
    await updateMemoryCache(language, cacheKey, translated);

    return NextResponse.json({ translation: translated });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[ERROR] Translation API error:", error.message);
      return NextResponse.json(
        { error: "Translation failed", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("[ERROR] Unknown error occurred:", error);
      return NextResponse.json(
        { error: "An unknown error occurred.", details: String(error) },
        { status: 500 }
      );
    }
  }
}
