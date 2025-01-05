// src/app/api/translate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { translateText } from "@/utils/TranslateModule/translateText";

type TranslationCache = Record<string, string>;

const translationsFilePath = path.resolve(process.cwd(), "translations.json");
const MAX_CACHE_SIZE = 1000;

// JSON 파일에서 번역 데이터 로드
const loadTranslationCache = async (): Promise<TranslationCache> => {
  try {
    //console.log("[DEBUG] Loading translation cache...");
    await fs.access(translationsFilePath); // 파일 접근 가능 여부 확인
    const data = await fs.readFile(translationsFilePath, "utf-8");
    //console.log("[DEBUG] Translation cache loaded.");
    return JSON.parse(data) as TranslationCache;
  } catch (error) {
    console.warn("[WARN] Translation file not found. Using empty cache.");
    return {}; // 파일이 없으면 빈 캐시 반환
  }
};

// JSON 파일에 번역 데이터 저장
const saveTranslationCache = async (cache: TranslationCache) => {
  try {
    //console.log("[DEBUG] Saving translation cache...");
    const keys = Object.keys(cache);
    if (keys.length > MAX_CACHE_SIZE) {
      const oldestKeys = keys.slice(0, keys.length - MAX_CACHE_SIZE);
      //console.log(`[DEBUG] Trimming cache. Removing ${oldestKeys.length} entries.`);
      oldestKeys.forEach((key) => delete cache[key]);
    }
    await fs.writeFile(
      translationsFilePath,
      JSON.stringify(cache, null, 2),
      "utf-8"
    );
    //console.log("[DEBUG] Translation cache saved successfully.");
  } catch (error) {
    //console.error("[ERROR] Failed to save translations:", error);
  }
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

    const cacheKey = `${text}_${language}`;
    //console.log(`[DEBUG] Cache key: ${cacheKey}`);

    // JSON 파일에서 캐시 로드
    const translationCache = await loadTranslationCache();

    // 캐시에서 번역 확인
    if (translationCache[cacheKey]) {
      //console.log("[DEBUG] Cache hit. Returning cached translation.");
      return NextResponse.json({ translation: translationCache[cacheKey] });
    }

    // 캐시에 없는 경우 번역
    //console.log("[DEBUG] Cache miss. Fetching translation from API...");
    const translated = await translateText(text, language);
    //console.log("[DEBUG] Translation fetched from API:", translated);

    // 캐시에 추가하고 저장
    translationCache[cacheKey] = translated;
    await saveTranslationCache(translationCache);

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
