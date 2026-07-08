"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">Đã có lỗi xảy ra</h1>
      <p className="text-secondary-token mb-4 text-sm">
        {error.message || "Vui lòng thử lại."}
      </p>
      <button onClick={reset} className="btn btn-primary">Thử lại</button>
    </div>
  );
}
