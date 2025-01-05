// src/utils/TranslateModule/translateCache.ts

import axios from "axios";

type TranslationCache = Record<string, string>;
const memoryCache: TranslationCache = {}; // 메모리 캐시

/**
 * Fetch translation from API
 */
export const fetchTranslation = async (text: string, language: string) => {
  const cacheKey = `${text}_${language}`;

  // 1. 메모리 캐시에서 데이터 확인
  if (memoryCache[cacheKey]) {
    //console.log(`[DEBUG] Cache hit for key: ${cacheKey}`);
    return memoryCache[cacheKey];
  }

  try {
    //console.log(`[DEBUG] Cache miss for key: ${cacheKey}. Fetching from API...`);
    // 2. API 호출
    const response = await axios.post("/api/translate", { text, language });
    const translation = response.data.translation;

    // 3. 캐시에 저장
    memoryCache[cacheKey] = translation;
    //console.log(`[DEBUG] Translation stored in memory cache for key: ${cacheKey}`);

    return translation;
  } catch (error) {
    console.error("Failed to fetch translation:", error);
    throw new Error("Translation API error");
  }
};
