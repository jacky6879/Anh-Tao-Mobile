# 🔧 Hướng Dẫn Fix Vấn Đề Cache - Web Về Giao Diện Cũ

## 📋 Tổng Quan Vấn Đề

Khi code đã được cập nhật với giao diện mới (BlogBodyEditor WYSIWYG trực quan) nhưng khi mở web lên vẫn thấy giao diện cũ (textarea HTML thuần). Nguyên nhân chính là do **cache của Next.js** và **browser cache**.

## ✅ Đã Thực Hiện

Em đã xóa thư mục `.next` (build cache của Next.js) để đảm bảo code mới sẽ được build lại từ đầu.

## 🚀 Các Bước Tiếp Theo

### 1. Restart Development Server

**Bước 1:** Tắt dev server hiện tại (nếu đang chạy)
- Nhấn `Ctrl + C` trong terminal đang chạy `npm run dev`
- Hoặc tìm process Node.js và kill nó:
  ```bash
  taskkill /F /PID 18952
  ```

**Bước 2:** Khởi động lại dev server
```bash
cd "G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN"
npm run dev
```

### 2. Xóa Browser Cache

**Cách 1: Hard Refresh (Khuyến nghị)**
- Mở trình duyệt và vào trang admin blog
- Nhấn `Ctrl + Shift + R` (hoặc `Ctrl + F5`)
- Điều này sẽ reload trang và bỏ qua cache

**Cách 2: Clear Cache Trong DevTools**
- Nhấn `F12` để mở DevTools
- Click chuột phải vào nút Reload (refresh)
- Chọn "Empty Cache and Hard Reload"

**Cách 3: Xóa Cache Hoàn Toàn**
- Chrome: `Ctrl + Shift + Delete` → Chọn "Cached images and files" → Clear data
- Edge: Tương tự như Chrome
- Firefox: `Ctrl + Shift + Delete` → Chọn "Cache" → Clear Now

### 3. Kiểm Tra Kết Quả

Sau khi restart server và clear cache, vào trang:
```
http://localhost:3000/admin/blogs/new
```

Anh sẽ thấy giao diện mới với:
- ✅ Nút "Thêm ảnh từ máy tính" màu xanh primary
- ✅ Nút "Thư viện ảnh"
- ✅ Thanh công cụ định dạng (Bold, Italic, H2, H3, danh sách)
- ✅ Vùng soạn thảo WYSIWYG (contentEditable) thay vì textarea
- ✅ Chế độ chuyển đổi "Trực quan" ↔ "Mã HTML"
- ✅ Click vào ảnh để sửa alt text hoặc xóa

## 🔍 Nếu Vẫn Không Hoạt Động

### Kiểm tra file đang import đúng chưa

Xác nhận file [`BlogForm.tsx`](G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN\src\app\admin\blogs\[id]\BlogForm.tsx:1) có import đúng:

```typescript
import { BlogBodyEditor } from "@/components/admin/BlogBodyEditor";
```

Và sử dụng component:
```typescript
<BlogBodyEditor
  value={data.body || ""}
  onChange={(body) => setData({ ...data, body })}
/>
```

### Kiểm tra không có lỗi console

Mở DevTools (`F12`) → Console tab
- Nếu có lỗi import/module → component cũ sẽ được hiển thị
- Nếu có lỗi về `process.env` → kiểm tra file `.env.local`

### Kiểm tra Vercel deployment

Nếu vấn đề chỉ xảy ra trên production (Vercel):
1. Commit và push code mới lên GitHub/GitLab
2. Vercel sẽ tự động deploy lại
3. Hoặc trigger manual deploy từ Vercel dashboard
4. Sau khi deploy xong, clear browser cache và test lại

## 📝 Tóm Tắt Các File Quan Trọng

| File | Chức năng |
|------|-----------|
| [`BlogForm.tsx`](G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN\src\app\admin\blogs\[id]\BlogForm.tsx:1) | Form chính để sửa/tạo bài blog, sử dụng BlogBodyEditor |
| [`BlogBodyEditor.tsx`](G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN\src\components\admin\BlogBodyEditor.tsx:1) | Component WYSIWYG editor trực quan mới |
| [`ImageUpload.tsx`](G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN\src\components\admin\ImageUpload.tsx:1) | Component upload ảnh với drag-drop |
| [`MediaLibrary.tsx`](G:\VIBE CODE THẦY DUYỆT\App cho Anh Táo demo\Web Anh Táo FN\src\components\admin\MediaLibrary.tsx:1) | Modal thư viện ảnh để chọn ảnh có sẵn |

## 🎯 Kết Luận

Vấn đề "web về cũ" là do **Next.js cache** chưa được xóa. Em đã xóa thư mục `.next` và anh chỉ cần:
1. **Restart dev server** (`Ctrl+C` rồi `npm run dev` lại)
2. **Hard refresh browser** (`Ctrl+Shift+R`)

Sau 2 bước này, giao diện mới với BlogBodyEditor WYSIWYG sẽ hiển thị đầy đủ.

---

**Lưu ý:** Nếu deploy lên Vercel/Production, nhớ push code lên Git để trigger deployment mới, rồi clear browser cache trên môi trường production.
