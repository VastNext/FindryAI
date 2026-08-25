"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type MemorablePasswordOptions,
  type PasswordSeparator,
  type PasswordStrengthLevel,
  type PinOptions,
  type RandomPasswordOptions,
  estimateMemorablePassword,
  estimatePin,
  estimateRandomPassword,
  generateMemorablePassword,
  generatePin,
  generateRandomPassword,
} from "@/lib/password-generator";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  CopyIcon,
  DicesIcon,
  InfoIcon,
  KeyRoundIcon,
  LanguagesIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PasswordMode = "random" | "memorable" | "pin";
type Locale = "en" | "zh-CN" | "ja" | "es" | "fr" | "de";

interface Copy {
  title: string;
  subtitle: string;
  random: string;
  memorable: string;
  pin: string;
  randomDescription: string;
  memorableDescription: string;
  pinDescription: string;
  length: string;
  uppercase: string;
  lowercase: string;
  numbers: string;
  symbols: string;
  avoidAmbiguous: string;
  wordCount: string;
  separator: string;
  capitalize: string;
  includeNumber: string;
  copy: string;
  copied: string;
  copyFailed: string;
  regenerate: string;
  strength: string;
  entropy: string;
  veryWeak: string;
  weak: string;
  fair: string;
  strong: string;
  veryStrong: string;
  characters: string;
  words: string;
  digits: string;
  privacy: string;
  privacySummary: string;
  privacyBody: string;
  noServer: string;
  cryptoSecure: string;
  noCharacterSet: string;
  about: string;
}

const COPY: Record<Locale, Copy> = {
  en: {
    title: "Password Generator",
    subtitle:
      "Create a strong password locally. Nothing you generate leaves this browser.",
    random: "Random",
    memorable: "Memorable",
    pin: "PIN",
    randomDescription: "Maximum entropy for password managers and accounts.",
    memorableDescription: "A longer passphrase made from easy-to-type words.",
    pinDescription: "A numeric code for device locks and similar uses.",
    length: "Length",
    uppercase: "Uppercase (A–Z)",
    lowercase: "Lowercase (a–z)",
    numbers: "Numbers (0–9)",
    symbols: "Symbols (!@#$)",
    avoidAmbiguous: "Avoid ambiguous characters",
    wordCount: "Word count",
    separator: "Separator",
    capitalize: "Capitalize words",
    includeNumber: "Add a number at the end",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
    regenerate: "Regenerate",
    strength: "Strength",
    entropy: "Entropy",
    veryWeak: "Very weak",
    weak: "Weak",
    fair: "Fair",
    strong: "Strong",
    veryStrong: "Very strong",
    characters: "characters",
    words: "words",
    digits: "digits",
    privacy: "Private by design",
    privacySummary: "Generated on your device with the Web Crypto API.",
    privacyBody:
      "Passwords are generated locally and are never sent to FindryAI or any other server. Generated values are not stored in cookies, analytics, or local storage.",
    noServer: "No server requests",
    cryptoSecure: "Cryptographically secure",
    noCharacterSet: "Keep at least one character type enabled.",
    about: "How privacy works",
  },
  "zh-CN": {
    title: "密码生成器",
    subtitle: "在本地创建强密码。生成的任何内容都不会离开此浏览器。",
    random: "随机密码",
    memorable: "易记口令",
    pin: "PIN 码",
    randomDescription: "高熵随机密码，适合密码管理器与网站账户。",
    memorableDescription: "由易输入的单词组成更长、更好记的口令。",
    pinDescription: "适合设备锁屏等场景的纯数字代码。",
    length: "长度",
    uppercase: "大写字母 (A–Z)",
    lowercase: "小写字母 (a–z)",
    numbers: "数字 (0–9)",
    symbols: "符号 (!@#$)",
    avoidAmbiguous: "避免易混淆字符",
    wordCount: "单词数量",
    separator: "分隔符",
    capitalize: "单词首字母大写",
    includeNumber: "末尾添加数字",
    copy: "复制",
    copied: "已复制",
    copyFailed: "复制失败",
    regenerate: "重新生成",
    strength: "强度",
    entropy: "熵值",
    veryWeak: "非常弱",
    weak: "较弱",
    fair: "一般",
    strong: "强",
    veryStrong: "非常强",
    characters: "个字符",
    words: "个单词",
    digits: "位数字",
    privacy: "隐私优先",
    privacySummary: "使用 Web Crypto API 在你的设备上生成。",
    privacyBody:
      "密码完全在本地生成，不会发送给 FindryAI 或任何其他服务器。生成结果不会写入 Cookie、分析服务或本地存储。",
    noServer: "无服务端请求",
    cryptoSecure: "密码学安全随机数",
    noCharacterSet: "请至少保留一种字符类型。",
    about: "隐私如何得到保护",
  },
  ja: {
    title: "パスワード生成ツール",
    subtitle:
      "強力なパスワードを端末内で作成します。ブラウザの外には送信されません。",
    random: "ランダム",
    memorable: "覚えやすい",
    pin: "PIN",
    randomDescription: "アカウントやパスワード管理に適した高エントロピー。",
    memorableDescription: "入力しやすい単語で作る長いパスフレーズ。",
    pinDescription: "端末ロックなどに使う数字コード。",
    length: "長さ",
    uppercase: "大文字 (A–Z)",
    lowercase: "小文字 (a–z)",
    numbers: "数字 (0–9)",
    symbols: "記号 (!@#$)",
    avoidAmbiguous: "紛らわしい文字を除外",
    wordCount: "単語数",
    separator: "区切り",
    capitalize: "先頭を大文字にする",
    includeNumber: "末尾に数字を追加",
    copy: "コピー",
    copied: "コピー済み",
    copyFailed: "コピー失敗",
    regenerate: "再生成",
    strength: "強度",
    entropy: "エントロピー",
    veryWeak: "非常に弱い",
    weak: "弱い",
    fair: "普通",
    strong: "強い",
    veryStrong: "非常に強い",
    characters: "文字",
    words: "単語",
    digits: "桁",
    privacy: "プライバシー設計",
    privacySummary: "Web Crypto API で端末内生成。",
    privacyBody:
      "生成したパスワードはサーバーへ送信されず、Cookie、分析、ローカルストレージにも保存されません。",
    noServer: "サーバー通信なし",
    cryptoSecure: "暗号学的に安全",
    noCharacterSet: "1種類以上の文字を有効にしてください。",
    about: "プライバシーについて",
  },
  es: {
    title: "Generador de contraseñas",
    subtitle:
      "Crea una contraseña segura en tu dispositivo. Nada sale del navegador.",
    random: "Aleatoria",
    memorable: "Memorable",
    pin: "PIN",
    randomDescription:
      "Máxima entropía para cuentas y gestores de contraseñas.",
    memorableDescription:
      "Una frase larga formada por palabras fáciles de escribir.",
    pinDescription: "Un código numérico para bloquear dispositivos.",
    length: "Longitud",
    uppercase: "Mayúsculas (A–Z)",
    lowercase: "Minúsculas (a–z)",
    numbers: "Números (0–9)",
    symbols: "Símbolos (!@#$)",
    avoidAmbiguous: "Evitar caracteres ambiguos",
    wordCount: "Número de palabras",
    separator: "Separador",
    capitalize: "Capitalizar palabras",
    includeNumber: "Añadir un número al final",
    copy: "Copiar",
    copied: "Copiada",
    copyFailed: "Error al copiar",
    regenerate: "Regenerar",
    strength: "Fortaleza",
    entropy: "Entropía",
    veryWeak: "Muy débil",
    weak: "Débil",
    fair: "Aceptable",
    strong: "Fuerte",
    veryStrong: "Muy fuerte",
    characters: "caracteres",
    words: "palabras",
    digits: "dígitos",
    privacy: "Privada por diseño",
    privacySummary: "Generada en tu dispositivo con Web Crypto API.",
    privacyBody:
      "Las contraseñas nunca se envían a un servidor ni se guardan en cookies, analítica o almacenamiento local.",
    noServer: "Sin peticiones al servidor",
    cryptoSecure: "Seguridad criptográfica",
    noCharacterSet: "Mantén activo al menos un tipo de carácter.",
    about: "Cómo protegemos tu privacidad",
  },
  fr: {
    title: "Générateur de mots de passe",
    subtitle:
      "Créez un mot de passe fort sur votre appareil. Rien ne quitte le navigateur.",
    random: "Aléatoire",
    memorable: "Mémorable",
    pin: "PIN",
    randomDescription: "Entropie maximale pour vos comptes et gestionnaires.",
    memorableDescription:
      "Une phrase longue composée de mots faciles à saisir.",
    pinDescription: "Un code numérique pour verrouiller vos appareils.",
    length: "Longueur",
    uppercase: "Majuscules (A–Z)",
    lowercase: "Minuscules (a–z)",
    numbers: "Chiffres (0–9)",
    symbols: "Symboles (!@#$)",
    avoidAmbiguous: "Éviter les caractères ambigus",
    wordCount: "Nombre de mots",
    separator: "Séparateur",
    capitalize: "Mettre une majuscule",
    includeNumber: "Ajouter un nombre à la fin",
    copy: "Copier",
    copied: "Copié",
    copyFailed: "Échec de la copie",
    regenerate: "Régénérer",
    strength: "Force",
    entropy: "Entropie",
    veryWeak: "Très faible",
    weak: "Faible",
    fair: "Correct",
    strong: "Fort",
    veryStrong: "Très fort",
    characters: "caractères",
    words: "mots",
    digits: "chiffres",
    privacy: "Confidentiel par conception",
    privacySummary: "Généré sur votre appareil avec Web Crypto API.",
    privacyBody:
      "Les mots de passe ne sont jamais envoyés à un serveur ni stockés dans les cookies, l’analytique ou le stockage local.",
    noServer: "Aucune requête serveur",
    cryptoSecure: "Sécurité cryptographique",
    noCharacterSet: "Gardez au moins un type de caractère actif.",
    about: "Protection de votre vie privée",
  },
  de: {
    title: "Passwort-Generator",
    subtitle:
      "Erstellen Sie ein starkes Passwort auf Ihrem Gerät. Nichts verlässt den Browser.",
    random: "Zufällig",
    memorable: "Merkbar",
    pin: "PIN",
    randomDescription: "Maximale Entropie für Konten und Passwortmanager.",
    memorableDescription: "Eine lange Passphrase aus leicht tippbaren Wörtern.",
    pinDescription: "Ein Zahlencode für Gerätesperren.",
    length: "Länge",
    uppercase: "Großbuchstaben (A–Z)",
    lowercase: "Kleinbuchstaben (a–z)",
    numbers: "Zahlen (0–9)",
    symbols: "Symbole (!@#$)",
    avoidAmbiguous: "Mehrdeutige Zeichen vermeiden",
    wordCount: "Wortanzahl",
    separator: "Trennzeichen",
    capitalize: "Wörter großschreiben",
    includeNumber: "Zahl am Ende hinzufügen",
    copy: "Kopieren",
    copied: "Kopiert",
    copyFailed: "Kopieren fehlgeschlagen",
    regenerate: "Neu generieren",
    strength: "Stärke",
    entropy: "Entropie",
    veryWeak: "Sehr schwach",
    weak: "Schwach",
    fair: "Mittel",
    strong: "Stark",
    veryStrong: "Sehr stark",
    characters: "Zeichen",
    words: "Wörter",
    digits: "Ziffern",
    privacy: "Privat entwickelt",
    privacySummary: "Auf Ihrem Gerät mit der Web Crypto API erzeugt.",
    privacyBody:
      "Passwörter werden nie an einen Server gesendet oder in Cookies, Analysen oder lokalem Speicher abgelegt.",
    noServer: "Keine Serveranfragen",
    cryptoSecure: "Kryptografisch sicher",
    noCharacterSet: "Mindestens einen Zeichentyp aktiviert lassen.",
    about: "So schützen wir Ihre Privatsphäre",
  },
};

const LOCALES: Array<{ value: Locale; label: string }> = [
  { value: "en", label: "English" },
  { value: "zh-CN", label: "简体中文" },
  { value: "ja", label: "日本語" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

const SEPARATOR_LABELS: Record<Locale, Record<PasswordSeparator, string>> = {
  en: {
    hyphen: "Hyphen ( - )",
    period: "Period ( . )",
    underscore: "Underscore ( _ )",
    comma: "Comma ( , )",
    space: "Space",
    number: "Random number",
    none: "None",
  },
  "zh-CN": {
    hyphen: "连字符 ( - )",
    period: "句点 ( . )",
    underscore: "下划线 ( _ )",
    comma: "逗号 ( , )",
    space: "空格",
    number: "随机数字",
    none: "无",
  },
  ja: {
    hyphen: "ハイフン ( - )",
    period: "ピリオド ( . )",
    underscore: "アンダースコア ( _ )",
    comma: "カンマ ( , )",
    space: "スペース",
    number: "ランダムな数字",
    none: "なし",
  },
  es: {
    hyphen: "Guion ( - )",
    period: "Punto ( . )",
    underscore: "Guion bajo ( _ )",
    comma: "Coma ( , )",
    space: "Espacio",
    number: "Número aleatorio",
    none: "Ninguno",
  },
  fr: {
    hyphen: "Tiret ( - )",
    period: "Point ( . )",
    underscore: "Trait bas ( _ )",
    comma: "Virgule ( , )",
    space: "Espace",
    number: "Nombre aléatoire",
    none: "Aucun",
  },
  de: {
    hyphen: "Bindestrich ( - )",
    period: "Punkt ( . )",
    underscore: "Unterstrich ( _ )",
    comma: "Komma ( , )",
    space: "Leerzeichen",
    number: "Zufallszahl",
    none: "Keine",
  },
};

const DEFAULT_RANDOM: RandomPasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
};
const DEFAULT_MEMORABLE: MemorablePasswordOptions = {
  wordCount: 4,
  separator: "hyphen",
  capitalize: true,
  includeNumber: true,
};
const DEFAULT_PIN: PinOptions = { length: 6 };
const LOCALE_STORAGE_KEY = "findry-password-generator-locale";

function detectLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && LOCALES.some(({ value }) => value === stored))
    return stored as Locale;
  const browserLocale = navigator.language;
  if (browserLocale.toLowerCase().startsWith("zh")) return "zh-CN";
  const shortLocale = browserLocale.split("-")[0] as Locale;
  return LOCALES.some(({ value }) => value === shortLocale)
    ? shortLocale
    : "en";
}

export function PasswordGenerator() {
  const [locale, setLocale] = useState<Locale>("en");
  const [mode, setMode] = useState<PasswordMode>("random");
  const [randomOptions, setRandomOptions] = useState(DEFAULT_RANDOM);
  const [memorableOptions, setMemorableOptions] = useState(DEFAULT_MEMORABLE);
  const [pinOptions, setPinOptions] = useState(DEFAULT_PIN);
  const [password, setPassword] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [characterWarning, setCharacterWarning] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyOperation = useRef(0);
  const text = COPY[locale];

  useEffect(() => setLocale(detectLocale()), []);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const regenerate = useCallback(() => {
    copyOperation.current += 1;
    if (copyTimer.current) clearTimeout(copyTimer.current);
    setCopyState("idle");
    if (mode === "random") setPassword(generateRandomPassword(randomOptions));
    else if (mode === "memorable")
      setPassword(generateMemorablePassword(memorableOptions));
    else setPassword(generatePin(pinOptions));
  }, [mode, randomOptions, memorableOptions, pinOptions]);

  useEffect(() => regenerate(), [regenerate]);

  const strength = useMemo(() => {
    if (mode === "random") return estimateRandomPassword(randomOptions);
    if (mode === "memorable")
      return estimateMemorablePassword(memorableOptions);
    return estimatePin(pinOptions);
  }, [mode, randomOptions, memorableOptions, pinOptions]);

  const strengthLabel: Record<PasswordStrengthLevel, string> = {
    "very-weak": text.veryWeak,
    weak: text.weak,
    fair: text.fair,
    strong: text.strong,
    "very-strong": text.veryStrong,
  };
  const strengthColor: Record<PasswordStrengthLevel, string> = {
    "very-weak": "bg-destructive",
    weak: "bg-orange-500",
    fair: "bg-amber-500",
    strong: "bg-primary",
    "very-strong": "bg-emerald-500",
  };

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  };

  const copyPassword = async () => {
    const operation = copyOperation.current + 1;
    copyOperation.current = operation;
    try {
      await navigator.clipboard.writeText(password);
      if (copyOperation.current === operation) setCopyState("copied");
    } catch {
      if (copyOperation.current === operation) setCopyState("error");
    }
    if (copyOperation.current !== operation) return;
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 1800);
  };

  const toggleCharacterSet = (
    key: "uppercase" | "lowercase" | "numbers" | "symbols",
    checked: boolean,
  ) => {
    const next = { ...randomOptions, [key]: checked };
    if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) {
      setCharacterWarning(true);
      return;
    }
    setCharacterWarning(false);
    setRandomOptions(next);
  };

  const countLabel =
    mode === "random"
      ? `${randomOptions.length} ${text.characters}`
      : mode === "memorable"
        ? `${memorableOptions.wordCount} ${text.words}`
        : `${pinOptions.length} ${text.digits}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={locale}
          onValueChange={(value) => changeLocale(value as Locale)}
        >
          <SelectTrigger className="w-[160px]" aria-label="Language">
            <LanguagesIcon className="mr-2 size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOCALES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as PasswordMode)}
      >
        <TabsList className="grid h-auto w-full grid-cols-3 p-1">
          <TabsTrigger value="random" className="gap-2 py-2.5">
            <DicesIcon className="hidden size-4 sm:block" />
            {text.random}
          </TabsTrigger>
          <TabsTrigger value="memorable" className="gap-2 py-2.5">
            <KeyRoundIcon className="hidden size-4 sm:block" />
            {text.memorable}
          </TabsTrigger>
          <TabsTrigger value="pin" className="gap-2 py-2.5">
            <ShieldCheckIcon className="hidden size-4 sm:block" />
            {text.pin}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <output
              className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-md bg-muted/70 px-4 py-4 font-mono text-lg font-semibold tracking-wide sm:text-xl"
              aria-live="polite"
            >
              {password}
            </output>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button variant="outline" onClick={regenerate} className="gap-2">
                <RefreshCwIcon className="size-4" />
                <span className="sm:sr-only lg:not-sr-only">
                  {text.regenerate}
                </span>
              </Button>
              <Button
                onClick={copyPassword}
                className="gap-2"
                aria-live="polite"
              >
                {copyState === "copied" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
                {copyState === "copied"
                  ? text.copied
                  : copyState === "error"
                    ? text.copyFailed
                    : text.copy}
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{text.strength}</span>
              <span className="font-medium">
                {strengthLabel[strength.level]} · {text.entropy}{" "}
                {strength.entropyBits.toFixed(0)} bits
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  strengthColor[strength.level],
                )}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <section
        className="rounded-lg border bg-card p-5 sm:p-6"
        aria-labelledby="password-options-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="password-options-title" className="font-semibold">
              {mode === "random"
                ? text.random
                : mode === "memorable"
                  ? text.memorable
                  : text.pin}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "random"
                ? text.randomDescription
                : mode === "memorable"
                  ? text.memorableDescription
                  : text.pinDescription}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
            {countLabel}
          </span>
        </div>

        {mode === "random" && (
          <div className="space-y-6">
            <RangeOption
              label={text.length}
              value={randomOptions.length}
              min={4}
              max={64}
              onChange={(length) =>
                setRandomOptions({ ...randomOptions, length })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SwitchOption
                label={text.uppercase}
                checked={randomOptions.uppercase}
                onChange={(checked) => toggleCharacterSet("uppercase", checked)}
              />
              <SwitchOption
                label={text.lowercase}
                checked={randomOptions.lowercase}
                onChange={(checked) => toggleCharacterSet("lowercase", checked)}
              />
              <SwitchOption
                label={text.numbers}
                checked={randomOptions.numbers}
                onChange={(checked) => toggleCharacterSet("numbers", checked)}
              />
              <SwitchOption
                label={text.symbols}
                checked={randomOptions.symbols}
                onChange={(checked) => toggleCharacterSet("symbols", checked)}
              />
              <SwitchOption
                className="sm:col-span-2"
                label={text.avoidAmbiguous}
                checked={randomOptions.avoidAmbiguous}
                onChange={(avoidAmbiguous) =>
                  setRandomOptions({ ...randomOptions, avoidAmbiguous })
                }
              />
            </div>
            {characterWarning && (
              <p role="alert" className="text-sm text-destructive">
                {text.noCharacterSet}
              </p>
            )}
          </div>
        )}

        {mode === "memorable" && (
          <div className="space-y-6">
            <RangeOption
              label={text.wordCount}
              value={memorableOptions.wordCount}
              min={2}
              max={10}
              onChange={(wordCount) =>
                setMemorableOptions({ ...memorableOptions, wordCount })
              }
            />
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor="password-separator"
              >
                {text.separator}
              </label>
              <Select
                value={memorableOptions.separator}
                onValueChange={(separator) =>
                  setMemorableOptions({
                    ...memorableOptions,
                    separator: separator as PasswordSeparator,
                  })
                }
              >
                <SelectTrigger id="password-separator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SEPARATOR_LABELS[locale]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <SwitchOption
                label={text.capitalize}
                checked={memorableOptions.capitalize}
                onChange={(capitalize) =>
                  setMemorableOptions({ ...memorableOptions, capitalize })
                }
              />
              <SwitchOption
                label={text.includeNumber}
                checked={memorableOptions.includeNumber}
                onChange={(includeNumber) =>
                  setMemorableOptions({ ...memorableOptions, includeNumber })
                }
              />
            </div>
          </div>
        )}

        {mode === "pin" && (
          <RangeOption
            label={text.length}
            value={pinOptions.length}
            min={4}
            max={16}
            onChange={(length) => setPinOptions({ length })}
          />
        )}
      </section>

      <div className="flex flex-col gap-4 rounded-lg border border-primary/15 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">{text.privacy}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {text.privacySummary}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{text.noServer}</span>
              <span>{text.cryptoSecure}</span>
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <InfoIcon className="size-4" />
              {text.about}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{text.privacy}</DialogTitle>
              <DialogDescription className="pt-2 leading-6">
                {text.privacyBody}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function RangeOption({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="min-w-10 rounded-md bg-muted px-2 py-1 text-center font-mono text-sm">
          {value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => onChange(next)}
        aria-label={label}
      />
    </div>
  );
}

function SwitchOption({
  label,
  checked,
  onChange,
  className,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-md border bg-background px-4 py-3 text-sm",
        className,
      )}
    >
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
