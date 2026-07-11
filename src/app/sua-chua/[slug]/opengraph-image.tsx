import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";
import { formatPriceRange } from "@/lib/format";

export const runtime = "nodejs"; // Prisma requires nodejs runtime, not edge
export const alt = "Dịch vụ Sửa Chữa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let service;
  try {
    service = await prisma.repairService.findUnique({
      where: { slug },
    });
  } catch (e) {
    //
  }

  if (!service) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#0b1120", color: "#fff", fontSize: 64, fontWeight: "bold" }}>
          Dịch Vụ Sửa Chữa
        </div>
      ), { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0b1120",
          backgroundImage: "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "white",
          padding: "80px",
        }}
      >
        {/* Header / Brand */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <div style={{ background: "#3b82f6", color: "white", padding: "10px 24px", borderRadius: "30px", fontSize: 32, fontWeight: "bold", display: "flex", letterSpacing: "-0.5px" }}>
            ANH TÁO MOBILE
          </div>
          <span style={{ marginLeft: "24px", fontSize: 32, color: "#94a3b8" }}>Chuyên Gia Sửa Chữa</span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
            {service.title}
          </div>
          {service.shortDescription && (
            <div style={{ fontSize: 36, color: "#cbd5e1", marginTop: "24px", maxWidth: "900px", lineHeight: 1.4 }}>
              {service.shortDescription.slice(0, 100)}...
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid #1e293b", paddingTop: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px" }}>Mức Giá</span>
            <span style={{ fontSize: 48, fontWeight: "bold", color: "#3b82f6", marginTop: "8px" }}>
              {formatPriceRange(service.priceMin, service.priceMax)}
            </span>
          </div>

          <div style={{ display: "flex", gap: "40px" }}>
            {service.warranty && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 24, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px" }}>Bảo Hành</span>
                <span style={{ fontSize: 36, fontWeight: "bold", color: "#f8fafc", marginTop: "8px" }}>{service.warranty}</span>
              </div>
            )}
            {service.estimatedTime && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 24, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px" }}>Thời Gian</span>
                <span style={{ fontSize: 36, fontWeight: "bold", color: "#f8fafc", marginTop: "8px" }}>{service.estimatedTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
