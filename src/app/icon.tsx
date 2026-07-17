import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Favicon shown next to the URL in browser tabs and Google search results.
// Google requires the favicon to be a square that is a multiple of 48px.
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="Logo"
          width={96}
          height={96}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
