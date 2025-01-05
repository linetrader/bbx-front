import axios from "axios";

/**
 * Translate text using Google Translate API
 * @param text - The text to translate
 * @param targetLang - The target language code (e.g., "ko", "en", "jp")
 * @returns Translated text
 */
export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_URL;

  if (!apiKey) {
    throw new Error("Google Translate API key is missing");
  }

  if (!apiUrl) {
    throw new Error("Google API URL is missing");
  }

  try {
    const response = await axios.get(apiUrl, {
      params: {
        q: text, // 번역할 텍스트
        target: targetLang, // 대상 언어
        key: apiKey, // API 키
      },
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}
