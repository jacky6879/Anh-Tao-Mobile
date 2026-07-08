import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-6xl font-bold gradient-text">404</p>
      <h1 className="text-2xl font-bold mt-4 mb-2">Không tìm thấy trang</h1>
      <p className="text-secondary-token mb-6">Trang bạn tìm có thể đã bị di chuyển hoặc không tồn tại.</p>
      <Link href="/" className="btn btn-primary">Về trang chủ</Link>
    </div>
  );
}
