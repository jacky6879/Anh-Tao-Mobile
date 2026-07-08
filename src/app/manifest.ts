import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: env.NEXT_PUBLIC_SITE_NAME,
    short_name: "Anh Táo",
    description: "iPhone, iPad, MacBook cũ/mới và sửa chữa tại Bình Dương.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1120",
    theme_color: "#0f766e",
    lang: "vi",
  };
}
