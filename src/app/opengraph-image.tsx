import { ImageResponse } from "next/og";

export const alt = "Anh Táo Mobile — iPhone cũ, máy đẹp, bảo hành rõ ràng";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0b1120 0%, #0f766e 50%, #0d9488 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(45, 212, 191, 0.1)",
            display: "flex",
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            🍎
          </div>
          <span style={{ fontSize: 48, fontWeight: 800 }}>Anh Táo Mobile</span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            opacity: 0.9,
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          iPhone cũ, máy đẹp, bảo hành rõ ràng
        </p>

        {/* Features row */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
            fontSize: 18,
            opacity: 0.8,
          }}
        >
          <span>📱 iPhone • iPad • MacBook</span>
          <span>🔧 Sửa chữa lấy liền</span>
          <span>📍 Bình Dương</span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #f59e0b, #2dd4bf)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
