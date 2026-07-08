"use client";

import { useTransition } from "react";

export function StatusForm({ name, defaultValue, options }: { name: string; defaultValue: string; options: string[] }) {
  const [pending] = useTransition();
  return (
    <>
      <select name={name} defaultValue={defaultValue} className="input-token flex-1" disabled={pending}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <button type="submit" disabled={pending} className="btn btn-secondary">
        {pending ? "..." : "Cập nhật"}
      </button>
    </>
  );
}
