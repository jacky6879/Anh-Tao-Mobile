import { cookies } from "next/headers";

export const FLASH_COOKIE = "flash";
const FLASH_MAX_AGE = 30;

export type Flash = { type: "success" | "error" | "info"; message: string };

export async function setFlash(flash: Flash): Promise<void> {
  const store = await cookies();
  store.set(FLASH_COOKIE, encodeURIComponent(JSON.stringify(flash)), {
    maxAge: FLASH_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

export async function consumeFlash(): Promise<Flash | null> {
  const store = await cookies();
  const raw = store.get(FLASH_COOKIE)?.value;
  if (!raw) return null;
  store.set(FLASH_COOKIE, "", { maxAge: 0, path: "/" });
  try {
    return JSON.parse(raw) as Flash;
  } catch {
    return null;
  }
}
