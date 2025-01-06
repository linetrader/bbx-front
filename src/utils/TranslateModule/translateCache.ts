// src/utils/TranslateModule/translateCache.ts

// src/utils/TranslateModule/translateCache.ts

import axios from "axios";

type TranslationCache = Record<string, Record<string, string>>;
const memoryCache: TranslationCache = {}; // 메모리 캐시

/**
 * Update memory cache with new translation
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
 * Fetch translation from API
 */
export const fetchTranslation = async (text: string, language: string) => {
  const cacheKey = `${text}_${language}`;

  // 1. 메모리 캐시에서 데이터 확인
  if (memoryCache[language] && memoryCache[language][cacheKey]) {
    //console.log(`[DEBUG] Memory cache hit for key: ${cacheKey}`);
    return memoryCache[language][cacheKey];
  }

  try {
    //console.log(`[DEBUG] Cache miss for key: ${cacheKey}. Fetching from API...`);

    // 2. API 호출
    const response = await axios.post("/api/translate", { text, language });
    const translation = response.data.translation;

    // 3. 캐시에 저장
    await updateMemoryCache(language, cacheKey, translation);

    return translation;
  } catch (error) {
    console.error("Failed to fetch translation:", error);
    throw new Error("Translation API error");
  }
};

export { memoryCache };
