# Hướng dẫn Deploy lên Render.com

Hướng dẫn chi tiết từng bước để deploy ứng dụng Scribd Downloader lên Render.

## 📋 Yêu cầu

1. Tài khoản GitHub (đã có code của bạn trên GitHub)
2. Tài khoản Render.com (miễn phí)

---

## 🚀 Các bước Deploy

### Bước 1: Đăng ký/Đăng nhập Render

1. Truy cập https://render.com
2. Click **"Get Started for Free"** hoặc **"Sign In"**
3. Chọn **"Sign in with GitHub"** để đăng nhập bằng GitHub

### Bước 2: Tạo Web Service mới

1. Sau khi đăng nhập, bạn sẽ thấy Dashboard
2. Click nút **"New +"** ở góc trên bên trái
3. Chọn **"Web Service"**

### Bước 3: Connect GitHub Repository

1. Render sẽ hỏi bạn connect repository
2. Nếu lần đầu, bạn cần **authorize Render** để truy cập GitHub repos
3. Chọn repository của bạn (ví dụ: `your-username/scribd-dl`)
4. Click **"Connect"**

### Bước 4: Cấu hình Service

Render có thể tự động detect file `render.yaml` hoặc bạn có thể cấu hình thủ công:

#### Cách 1: Sử dụng render.yaml (Tự động - Khuyến nghị)

Nếu bạn đã có file `render.yaml` trong repo, Render sẽ tự động detect và sử dụng cấu hình từ file đó.

#### Cách 2: Cấu hình thủ công

Nếu không dùng `render.yaml`, điền các thông tin sau:

- **Name:** `scribd-dl` (hoặc tên bạn muốn)
- **Region:** `Singapore` (hoặc region gần bạn nhất)
- **Branch:** `main` (hoặc branch bạn muốn deploy)
- **Root Directory:** (để trống)
- **Environment:** Chọn **"Docker"**
- **Dockerfile Path:** `./Dockerfile`
- **Docker Context:** `.` (dấu chấm)
- **Docker Command:** (để trống, Dockerfile đã có CMD)

### Bước 5: Cấu hình Plan và Environment Variables

1. **Plan:** Chọn **"Free"** (750 giờ/tháng miễn phí)

2. **Environment Variables:** 
   Render sẽ tự động set PORT, nhưng bạn có thể thêm:
   ```
   NODE_ENV=production
   ```
   (PORT sẽ được Render tự động set, không cần thêm thủ công)

### Bước 6: Health Check (Tùy chọn)

- **Health Check Path:** `/api/status`
- Render sẽ kiểm tra endpoint này để đảm bảo service đang chạy

### Bước 7: Deploy

1. Click **"Create Web Service"**
2. Render sẽ bắt đầu build Docker image
3. Quá trình build có thể mất 5-10 phút (lần đầu sẽ lâu hơn)
4. Bạn có thể xem logs trong tab **"Logs"**

### Bước 8: Chờ Deploy hoàn thành

1. Bạn sẽ thấy progress trong Dashboard
2. Khi deploy thành công, bạn sẽ thấy:
   - ✅ Status: **Live**
   - 🌐 URL: `https://scribd-dl.onrender.com` (hoặc tên bạn đã đặt)

---

## ✅ Kiểm tra sau khi Deploy

1. **Truy cập URL:** Mở URL được cung cấp trong trình duyệt
2. **Kiểm tra Health Check:** Truy cập `https://your-app.onrender.com/api/status`
3. **Test Download:** Thử download một document để đảm bảo mọi thứ hoạt động

---

## 🔧 Troubleshooting

### Lỗi: Build failed

**Nguyên nhân có thể:**
- Dockerfile có lỗi
- Dependencies không install được
- Thiếu file cần thiết

**Giải pháp:**
1. Xem logs trong Render Dashboard → Tab "Logs"
2. Kiểm tra Dockerfile có đúng không
3. Đảm bảo tất cả file cần thiết đã được commit lên GitHub

### Lỗi: Service không start

**Nguyên nhân có thể:**
- PORT không được set đúng
- Server không listen đúng port

**Giải pháp:**
1. Kiểm tra environment variable PORT
2. Đảm bảo server.js sử dụng `process.env.PORT || 3000`
3. Xem logs để biết lỗi cụ thể

### Lỗi: Timeout

**Nguyên nhân:**
- Download mất quá nhiều thời gian
- Free tier có giới hạn timeout

**Giải pháp:**
- Free tier có timeout ~30 phút
- Nếu download lâu, có thể cần upgrade plan
- Hoặc optimize code để download nhanh hơn

### Lỗi: Puppeteer không chạy

**Nguyên nhân:**
- Thiếu dependencies cho Puppeteer
- Không đủ memory

**Giải pháp:**
1. Đảm bảo Dockerfile có đầy đủ dependencies (đã có sẵn)
2. Free tier có 512MB RAM - có thể không đủ cho Puppeteer
3. Cân nhắc upgrade lên Starter plan ($7/tháng) để có 512MB RAM

---

## 📊 Monitoring

Render cung cấp:
- **Logs:** Xem real-time logs
- **Metrics:** CPU, Memory usage
- **Events:** Deploy history

Truy cập trong Dashboard của service.

---

## 🔄 Auto-Deploy

Render tự động deploy khi:
- Bạn push code lên branch được cấu hình (mặc định: main)
- Bạn manual trigger deploy từ Dashboard

Để tắt auto-deploy:
1. Vào Settings → Auto-Deploy
2. Tắt "Auto-Deploy"

---

## 🌐 Custom Domain

Để thêm custom domain:

1. Vào Settings → Custom Domain
2. Thêm domain của bạn
3. Follow hướng dẫn để setup DNS
4. Render sẽ tự động cấp SSL certificate

---

## 💰 Pricing

**Free Tier:**
- 750 giờ runtime/tháng
- 512MB RAM
- Sleep sau 15 phút không có traffic (wake up mất ~30 giây)

**Starter Plan ($7/tháng):**
- Unlimited runtime
- 512MB RAM
- Không sleep
- Better performance

---

## 📝 Lưu ý quan trọng

1. **Free tier sẽ sleep** sau 15 phút không có traffic
   - Request đầu tiên sau khi sleep sẽ mất ~30 giây để wake up
   - Đây là bình thường với free tier

2. **Memory limit:**
   - Free tier: 512MB RAM
   - Puppeteer cần nhiều RAM, có thể cần upgrade

3. **Build time:**
   - Lần đầu build sẽ lâu (5-10 phút)
   - Các lần sau sẽ nhanh hơn nhờ cache

4. **File storage:**
   - Files được lưu tạm trong container
   - Sau khi download xong, file được gửi về client và xóa
   - Không có persistent storage trên free tier

---

## 🎉 Hoàn thành!

Sau khi deploy thành công, bạn có thể:
- Chia sẻ URL với người khác
- Sử dụng ứng dụng để download documents
- Monitor và maintain từ Render Dashboard

Nếu có vấn đề, xem logs trong Render Dashboard hoặc kiểm tra troubleshooting section ở trên.

