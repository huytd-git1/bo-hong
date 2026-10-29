# 🌹 Bó Hoa Hồng 3D Tương Tác (3D Interactive Rose Bouquet)

Một ứng dụng web 3D mô phỏng bó hoa hồng lãng mạn và tinh tế, chạy hoàn toàn trực tiếp trên trình duyệt sử dụng React, Three.js và React Three Fiber.

![Bó Hoa Hồng 3D](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80)

---

## ✨ Điểm Nổi Bật & Tính Năng

### 1. Tạo Hình 3D Chân Thực & Tinh Tế
- **Mặc định:** 20 bông hồng phấn ngọt ngào (*20 bông - Chân thành*), giấy gói màu kem thanh nhã, lớp voan xếp nếp và nơ hồng lãng mạn.
- **Màn hình tĩnh lặng, thuần khiết (Không chữ):** Giao diện đã được tinh giản hoàn toàn, loại bỏ mọi thanh điều khiển và dòng chữ để toàn bộ không gian là tác phẩm nghệ thuật 3D sống động.
- **Que kẹp ảnh kỷ niệm ("Cắm trên bó hoa"):** Khi chạm/click vào bó hoa, các que kẹp ảnh polaroid chứa hình ảnh ngọt ngào của cô ấy sẽ từ từ vươn lên xen kẽ tự nhiên giữa những đóa hồng cùng hiệu ứng pháo hoa nhẹ nhàng!
- **Xem cận cảnh:** Chạm vào bất kỳ tấm ảnh nào để phóng to ngắm trọn vẹn từng khoảnh khắc (chạm vào nền để đóng).
- **Dễ dàng thay đổi ảnh:** Bạn chỉ cần sao chép các bức ảnh kỷ niệm thực tế của cô ấy vào thư mục `public/photos/` với các tên `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`.

### 2. Tương Tác
- Kéo chuột hoặc vuốt để xoay 360 độ ngắm bó hoa.
- Cuộn chuột hoặc chụm 2 ngón tay để phóng to/thu nhỏ.
- Chạm vào bó hoa để bật/thu các que ảnh kỷ niệm.
- **Tùy biến màu hoa:**
  - 🌹 **Đỏ Ruby:** Đằm thắm, quý phái với nơ đỏ nhung.
  - 🌸 **Hồng Phấn:** Ngọt ngào, dịu dàng với nơ hồng lãng mạn.
  - 🤍 **Trắng Tinh Khôi:** Thuần khiết, trang nhã với nơ vàng champagne.
- **Tùy chọn số lượng:**
  - **9 bông:** Mang ý nghĩa tình cảm vĩnh cửu.
  - **12 bông (Mặc định):** Biểu tượng của sự trọn vẹn và hoàn mỹ.
  - **20 bông:** Đại diện cho lòng chân thành sâu sắc.
  - *Bố cục bán cầu (hemisphere dome) tự động tính toán lại góc nghiêng và khoảng cách để bó hoa luôn tròn đầy, cân đối.*

### 3. Thiệp Lời Chúc Ý Nghĩa
- Nút **"Mở thiệp"** với hiệu ứng mở thiệp phong bì cổ điển sang trọng và pháo giấy confetti lung linh.
- Cho phép chỉnh sửa trực tiếp **Tên người nhận**, **Nội dung lời chúc**, và **Tên người gửi**.
- Tự động lưu lời chúc và màu hoa yêu thích vào `localStorage`.
- Không tự phát nhạc để đảm bảo trải nghiệm êm dịu, lịch sự cho người xem.

### 4. Tương Thích & Hiệu Năng
- Giao diện tiếng Việt hoàn chỉnh, chuẩn Typography với font Google Fonts (`Playfair Display`, `Be Vietnam Pro`, `Alex Brush`).
- Bảng điều khiển kính mờ (Glassmorphism) gọn gàng, tinh gọn ở cạnh dưới, tối ưu responsive trên cả máy tính và điện thoại.
- Giới hạn Pixel Ratio và tái sử dụng hình học để đạt 60fps mượt mà.
- Hỗ trợ phát hiện WebGL và tôn trọng tùy chọn `prefers-reduced-motion`.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### Yêu cầu môi trường
- [Node.js](https://nodejs.org/) phiên bản 18+ trở lên.
- Trình quản lý gói `npm` (đi kèm sẵn với Node.js).

### Các bước thực hiện

1. **Cài đặt thư viện phụ thuộc:**
   ```bash
   npm install
   ```

2. **Khởi chạy máy chủ phát triển (Dev server):**
   ```bash
   npm run dev
   ```
   Sau khi chạy, mở trình duyệt và truy cập vào đường dẫn hiển thị (thường là `http://localhost:5173/`).

3. **Đóng gói phiên bản Production:**
   ```bash
   npm run build
   ```
   Bản dựng hoàn chỉnh sẽ được tạo trong thư mục `dist/`.

4. **Xem thử bản build:**
   ```bash
   npm run preview
   ```

---

## 📁 Cấu Trúc Thư Mục

```
sinh-nhat/
├── index.html                           # Trang HTML chính, cấu hình Fonts & Meta SEO
├── package.json                         # Khai báo dependencies & scripts
├── src/
│   ├── main.jsx                         # Điểm khởi tạo ứng dụng React
│   ├── App.jsx                          # Thành phần chính quản lý state & localStorage
│   ├── App.css                          # Phong cách giao diện, glassmorphism & responsive
│   ├── index.css                        # CSS reset & design tokens
│   └── components/
│       ├── 3d/
│       │   ├── RoseGeometry.js          # Khối hình học BufferGeometry cánh hoa & giấy gói
│       │   ├── RoseFlower.jsx           # Bông hồng 3D hoàn chỉnh (cánh, đài hoa, cuống)
│       │   ├── BabyBreath.jsx           # Cành hoa phụ baby's breath (gypsophila)
│       │   ├── StemsAndLeaves.jsx       # Lá hoa hồng răng cưa & bó thân cành
│       │   ├── BouquetWrapper.jsx       # Giấy gói màu kem xếp ly, viền voan & nơ ruy băng
│       │   ├── Bouquet.jsx              # Bố cục bán cầu 9, 12, 20 bông
│       │   ├── FallingPetals.jsx        # Hệ thống cánh hoa rơi lãng mạn
│       │   └── Scene.jsx                # Canvas 3D, ánh sáng, bóng đổ & OrbitControls
│       └── ui/
│           ├── Header.jsx               # Tiêu đề & hướng dẫn tương tác
│           ├── ControlBar.jsx           # Bảng điều khiển kính mờ đổi màu, số lượng, góc nhìn
│           ├── GreetingCard.jsx         # Thiệp chúc mừng có thể sửa và lưu localStorage
│           └── WebGLFallback.jsx        # Màn hình tải & thông báo dự phòng WebGL
└── README.md
```

---

Chúc bạn có những giây phút thư giãn và trao gửi được những thông điệp ngọt ngào nhất! 💐
