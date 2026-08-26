export const languages = [
  { code: "auto", label: "Auto Detect" },
  { code: "zh-CN", label: "Simplified Chinese" },
  { code: "zh-TW", label: "Traditional Chinese" },
  { code: "en", label: "English" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ru", label: "Russian" },
] as const;

export const languageCodes = new Set(
  languages.map((language) => language.code),
);
