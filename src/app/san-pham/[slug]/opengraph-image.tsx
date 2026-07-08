import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const alt = "Sản phẩm — Anh Táo Mobile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CONDITION_LABELS: Record<string, string> = {
  new_seal: "New Seal",
  like_new: "Like New",
  percent99: "99%",
  used: "Đã dùng",
  light_scratch: "Trầy nhẹ",
  repaired: "Đã sửa chữa",
  unknown: "",
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: {
    title: string;
    price: number;
    comparePrice: number | null;
    condition: string;
    coverImage: string | null;
    brand: string | null;
    storage: string | null;
    warranty: string | null;
  } | null = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      select: {
        title: true,
        price: true,
        comparePrice: true,
        condition: true,
        coverImage: true,
        brand: true,
        storage: true,
        warranty: true,
      },
    });
  } catch {
    // DB unavailable — fallback to generic image
  }

  const title = product?.title ?? "Sản phẩm";
  const price = product ? formatPrice(product.price) : "";
  const condition = product
    ? (CONDITION_LABELS[product.condition] || "")
    : "";
  const specs = [product?.brand, product?.storage, product?.warranty]
    .filter(Boolean)
    .join(" • ");
  const discount =
    product?.comparePrice && product.comparePrice > product.price
      ? Math.round((1 - product.price / product.comparePrice) * 100)
      : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(160deg, #0b1120 0%, #134e4a 60%, #0f766e 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Product image area */}
        {product?.coverImage && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.15,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.coverImage}
              alt=""
              width={400}
              height={400}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            flex: 1,
            maxWidth: 800,
            gap: 16,
          }}
        >
          {/* Brand badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              🍎
            </div>
            <span style={{ fontSize: 20, opacity: 0.8 }}>Anh Táo Mobile</span>
          </div>

          {/* Product title */}
          <h1
            style={{
              fontSize: title.length > 40 ? 36 : 44,
              fontWeight: 800,
              lineHeight: 1.2,
              margin: 0,
              maxWidth: 650,
            }}
          >
            {title}
          </h1>

          {/* Condition + Specs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {condition && (
              <span
                style={{
                  background: "rgba(45, 212, 191, 0.2)",
                  border: "1px solid rgba(45, 212, 191, 0.4)",
                  borderRadius: 8,
                  padding: "6px 16px",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {condition}
              </span>
            )}
            {specs && (
              <span
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "6px 16px",
                  fontSize: 18,
                }}
              >
                {specs}
              </span>
            )}
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginTop: 8,
            }}
          >
            <span
              style={{ fontSize: 48, fontWeight: 800, color: "#2dd4bf" }}
            >
              {price}
            </span>
            {discount > 0 && (
              <span
                style={{
                  fontSize: 22,
                  background: "#ef4444",
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontWeight: 700,
                }}
              >
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent bar */}
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
