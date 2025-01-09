// src/utils/TranslateModule/translateCache.ts

import axios from "axios";

type TranslationCache = Record<string, Record<string, string>>;
const memoryCache: TranslationCache = {}; // 메모리 캐시

/**
 * 언어별 JSON 파일을 로드하여 메모리 캐시에 저장
 */
export const loadTranslationsToCache = async (language: string) => {
  if (memoryCache[language]) {
    // 이미 로드된 경우 재로딩 방지
    //console.log(`[DEBUG] Translations for '${language}' already loaded in memory cache.`);
    return;
  }

  try {
    // public/translations/{language}.json 파일에서 데이터 로드
    const response = await fetch(`/translations/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for '${language}'`);
    }

    const translations = await response.json();
    memoryCache[language] = translations;

    //console.log(`[DEBUG] Loaded translations for '${language}' into memory cache.`);
  } catch (error) {
    console.error(
      `[ERROR] Failed to load translation file for language '${language}':`,
      error
    );
    memoryCache[language] = {}; // 에러 시 빈 캐시를 초기화
  }
};

/**
 * 메모리 캐시에 번역 추가
 */
export const updateMemoryCache = async (
  language: string,
  cacheKey: string,
  translation: string
) => {
  if (!memoryCache[language]) {
    memoryCache[language] = {};
  }

  memoryCache[language][cacheKey] = translation;
  //console.log(`[DEBUG] Memory cache updated for language '${language}', key '${cacheKey}'`);
};

/**
 * 번역 데이터 가져오기
 */
export const fetchTranslation = async (text: string, language: string) => {
  const cacheKey = text;

  // 1. 언어 캐시가 없는 경우 로드
  if (!memoryCache[language]) {
    await loadTranslationsToCache(language);
  }

  // 2. 메모리 캐시에서 데이터 확인
  if (memoryCache[language][cacheKey]) {
    //console.log(`[DEBUG] Memory cache hit for key: ${cacheKey}`);
    return memoryCache[language][cacheKey];
  }

  try {
    // 3. 캐시에 없는 경우 API 호출
    //console.log(`[DEBUG] Cache miss for key: ${cacheKey}. Fetching from API...`);
    const response = await axios.post("/api/translate", { text, language });
    const translation = response.data.translation;

    // 4. 캐시에 저장
    await updateMemoryCache(language, cacheKey, translation);

    return translation;
  } catch (error) {
    console.error("Failed to fetch translation:", error);
    throw new Error("Translation API error");
  }
};

export { memoryCache };
