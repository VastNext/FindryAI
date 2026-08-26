import { PASSWORD_WORD_LIST } from "@/lib/password-word-list";

export const PASSWORD_CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*-_=+[]{}<>?/|~",
} as const;

const AMBIGUOUS_CHARACTERS = new Set("0O1lI|`B8S5Z2G6");

export interface RandomPasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

export type PasswordSeparator =
  | "hyphen"
  | "period"
  | "underscore"
  | "comma"
  | "space"
  | "number"
  | "none";

export interface MemorablePasswordOptions {
  wordCount: number;
  separator: PasswordSeparator;
  capitalize: boolean;
  includeNumber: boolean;
}

export interface PinOptions {
  length: number;
}

export type PasswordStrengthLevel =
  | "very-weak"
  | "weak"
  | "fair"
  | "strong"
  | "very-strong";

export interface PasswordStrengthResult {
  entropyBits: number;
  level: PasswordStrengthLevel;
  percent: number;
}

const SEPARATORS: Record<PasswordSeparator, string> = {
  hyphen: "-",
  period: ".",
  underscore: "_",
  comma: ",",
  space: " ",
  number: "",
  none: "",
};

export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error("随机数上限必须为正数");
  }
  if (maxExclusive === 1) return 0;

  const range = 0x1_0000_0000;
  const limit = range - (range % maxExclusive);
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % maxExclusive;
}

function pickCharacter(pool: string): string {
  return pool.charAt(secureRandomInt(pool.length));
}

function selectedCharacterSets(options: RandomPasswordOptions): string[] {
  const sets: string[] = [];
  if (options.uppercase) sets.push(PASSWORD_CHAR_SETS.uppercase);
  if (options.lowercase) sets.push(PASSWORD_CHAR_SETS.lowercase);
  if (options.numbers) sets.push(PASSWORD_CHAR_SETS.numbers);
  if (options.symbols) sets.push(PASSWORD_CHAR_SETS.symbols);

  return options.avoidAmbiguous
    ? sets.map((set) =>
        Array.from(set)
          .filter((character) => !AMBIGUOUS_CHARACTERS.has(character))
          .join(""),
      )
    : sets;
}

export function generateRandomPassword(options: RandomPasswordOptions): string {
  const sets = selectedCharacterSets(options);
  if (sets.length === 0) return "";

  const pool = sets.join("");
  const length = Math.max(options.length, sets.length);

  // 从完整字符池均匀采样；若缺少某个已选字符集，则整体拒绝并重新采样。
  // 这样既满足每类字符至少出现一次，也保持约束结果空间内的均匀分布。
  while (true) {
    const password = Array.from({ length }, () => pickCharacter(pool)).join("");
    if (
      sets.every((set) =>
        Array.from(set).some((character) => password.includes(character)),
      )
    ) {
      return password;
    }
  }
}

export function generateMemorablePassword(
  options: MemorablePasswordOptions,
): string {
  const parts: string[] = [];
  const separator = SEPARATORS[options.separator];

  for (let index = 0; index < options.wordCount; index++) {
    let word: string =
      PASSWORD_WORD_LIST[secureRandomInt(PASSWORD_WORD_LIST.length)];
    if (options.capitalize) {
      word = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    }
    parts.push(word);

    if (index < options.wordCount - 1) {
      parts.push(
        options.separator === "number"
          ? secureRandomInt(10).toString()
          : separator,
      );
    }
  }

  if (options.includeNumber) {
    parts.push(`${secureRandomInt(10)}${secureRandomInt(10)}`);
  }

  return parts.join("");
}

export function generatePin(options: PinOptions): string {
  const length = Math.min(Math.max(options.length, 4), 16);
  return Array.from({ length }, () => secureRandomInt(10)).join("");
}

function strengthFromEntropy(entropyBits: number): PasswordStrengthResult {
  let level: PasswordStrengthLevel = "very-strong";
  if (entropyBits < 28) level = "very-weak";
  else if (entropyBits < 40) level = "weak";
  else if (entropyBits < 60) level = "fair";
  else if (entropyBits < 100) level = "strong";

  return {
    entropyBits,
    level,
    percent:
      entropyBits === 0
        ? 0
        : Math.min(100, Math.max(2, (entropyBits / 120) * 100)),
  };
}

export function estimateRandomPassword(
  options: RandomPasswordOptions,
): PasswordStrengthResult {
  const sets = selectedCharacterSets(options);
  const poolSize = sets.reduce((total, set) => total + set.length, 0);
  if (poolSize === 0) return strengthFromEntropy(0);

  // 生成器要求每个已选字符集至少出现一次。用容斥原理计算满足约束的
  // 精确结果数量，避免把完整字符池的理论熵误报为实际生成熵。
  let validPasswordCount = 0;
  const subsetCount = 2 ** sets.length;
  for (let mask = 0; mask < subsetCount; mask++) {
    let excludedSize = 0;
    let excludedSetCount = 0;
    for (let index = 0; index < sets.length; index++) {
      if ((mask & (1 << index)) !== 0) {
        excludedSize += sets[index].length;
        excludedSetCount += 1;
      }
    }
    const candidateCount = (poolSize - excludedSize) ** options.length;
    validPasswordCount +=
      excludedSetCount % 2 === 0 ? candidateCount : -candidateCount;
  }

  return strengthFromEntropy(Math.log2(validPasswordCount));
}

export function estimateMemorablePassword(
  options: MemorablePasswordOptions,
): PasswordStrengthResult {
  let entropyBits = options.wordCount * Math.log2(PASSWORD_WORD_LIST.length);
  if (options.separator === "number") {
    entropyBits += (options.wordCount - 1) * Math.log2(10);
  }
  if (options.includeNumber) entropyBits += Math.log2(100);
  return strengthFromEntropy(entropyBits);
}

export function estimatePin(options: PinOptions): PasswordStrengthResult {
  return strengthFromEntropy(options.length * Math.log2(10));
}
