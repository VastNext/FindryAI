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
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PasswordMode = "random" | "memorable" | "pin";

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

const COPY: Copy = {
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
};

const SEPARATOR_LABELS: Record<PasswordSeparator, string> = {
  hyphen: "Hyphen ( - )",
  period: "Period ( . )",
  underscore: "Underscore ( _ )",
  comma: "Comma ( , )",
  space: "Space",
  number: "Random number",
  none: "None",
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
export function PasswordGenerator() {
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
  const text = COPY;

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
                  {Object.entries(SEPARATOR_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
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
