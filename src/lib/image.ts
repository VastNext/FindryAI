import { dataset, projectId } from "@/sanity/lib/api";
import createImageUrlBuilder from "@sanity/image-url";

/**
 * https://www.sanity.io/docs/image-url
 */
const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  source: any,
  options: { width?: number; height?: number; quality?: number } = {},
) => {
  if (!source || !source.asset) return;
  const dimensions = source?.asset?._ref?.split("-")?.[2];

  let width: number | undefined;
  let height: number | undefined;

  if (dimensions) {
    const [w, h] = dimensions
      .split("x")
      .map((num: string) => Number.parseInt(num, 10));
    width = w;
    height = h;
  }

  const targetWidth = options.width ?? (width ? Math.min(width, 1200) : 1200);
  const targetQuality = options.quality ?? 80;

  let builder = imageBuilder
    .image(source)
    .auto("format")
    .quality(targetQuality)
    .width(targetWidth);

  if (options.height) {
    builder = builder.height(options.height);
  }

  const url = builder.url();

  return {
    src: url,
    width: options.width ?? width,
    height: options.height ?? height,
  };
};

export const urlForIcon = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  source: any,
  options: { size?: number; quality?: number } = {},
) => {
  if (!source || !source.asset) return;
  const dimensions = source?.asset?._ref?.split("-")?.[2];

  let width: number | undefined;
  let height: number | undefined;

  if (dimensions) {
    const [w, h] = dimensions
      .split("x")
      .map((num: string) => Number.parseInt(num, 10));
    width = w;
    height = h;
  }

  const targetSize = options.size ?? 64;
  const targetQuality = options.quality ?? 85;

  const url = imageBuilder
    .image(source)
    .auto("format")
    .quality(targetQuality)
    .width(targetSize)
    .height(targetSize)
    .fit("crop")
    .url();

  return {
    src: url,
    width: targetSize,
    height: targetSize,
  };
};
