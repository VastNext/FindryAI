import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get("theme") === "light" ? "light" : "dark";
  const label = searchParams.get("label") || "FEATURED ON";
  const brand = searchParams.get("brand") || "Findry AI";

  const isDark = theme === "dark";
  const bgColor = isDark ? "#09090b" : "#ffffff";
  const borderColor = isDark ? "#27272a" : "#e4e4e7";
  const labelColor = isDark ? "#a1a1aa" : "#71717a";
  const brandColor = isDark ? "#fafafa" : "#18181b";
  const accentColor = "#6366f1"; // Indigo accent

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="54" viewBox="0 0 220 54" fill="none">
  <rect width="220" height="54" rx="10" fill="${bgColor}"/>
  <rect x="0.5" y="0.5" width="219" height="53" rx="9.5" stroke="${borderColor}"/>
  
  <!-- Findry AI Sparkle Icon -->
  <g transform="translate(14, 13)">
    <rect width="28" height="28" rx="7" fill="${accentColor}" fill-opacity="0.15"/>
    <path d="M14 6L15.8 11.2L21 13L15.8 14.8L14 20L12.2 14.8L7 13L12.2 11.2L14 6Z" fill="${accentColor}"/>
  </g>
  
  <!-- Text Section -->
  <text x="52" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="9" font-weight="700" letter-spacing="0.08em" fill="${labelColor}">${label.toUpperCase()}</text>
  <text x="52" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="-0.02em" fill="${brandColor}">${brand}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}
