# Hướng dẫn Deploy Miễn Phí

Ứng dụng này có thể được deploy miễn phí trên các nền tảng sau:

## 🚂 Railway.app (Khuyến nghị)

**Free Tier:**
- $5 credit miễn phí mỗi tháng
- Hỗ trợ Docker
- Auto-deploy từ GitHub
- Custom domain

### Cách deploy:

1. **Đăng ký tài khoản:**
   - Truy cập https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo project mới:**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Cấu hình:**
   - Railway sẽ tự động detect Dockerfile
   - Đảm bảo PORT được set trong environment variables (mặc định: 3000)

4. **Deploy:**
   - Railway sẽ tự động build và deploy
   - Sau khi deploy xong, bạn sẽ nhận được URL public

### Environment Variables (tùy chọn):
```
PORT=3000
NODE_ENV=production
```

---

## 🎨 Render.com

**Free Tier:**
- 750 giờ runtime/tháng
- Hỗ trợ Docker
- Auto-deploy từ GitHub
- Custom domain

### Cách deploy:

1. **Đăng ký tài khoản:**
   - Truy cập https://render.com
   - Đăng nhập bằng GitHub

2. **Tạo Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository

3. **Cấu hình:**
   - **Name:** scribd-dl (hoặc tên bạn muốn)
   - **Environment:** Docker
   - **Dockerfile Path:** ./Dockerfile
   - **Docker Context:** .
   - **Plan:** Free
   - **Start Command:** (để trống, Dockerfile đã có CMD)

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Render sẽ tự động build và deploy

---

## 🚀 Fly.io

**Free Tier:**
- 3 shared VMs miễn phí
- Hỗ trợ Docker
- Global edge network

### Cách deploy:

1. **Cài đặt Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Đăng nhập:**
   ```bash
   fly auth login
   ```

3. **Tạo app:**
   ```bash
   fly launch
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

---

## 📋 So sánh các nền tảng

| Nền tảng | Free Tier | Docker | Auto-deploy | Custom Domain |
|----------|-----------|-------|-------------|---------------|
| Railway  | $5/tháng   | ✅    | ✅          | ✅            |
| Render   | 750h/tháng | ✅    | ✅          | ✅            |
| Fly.io   | 3 VMs      | ✅    | ✅          | ✅            |

## ⚠️ Lưu ý quan trọng

1. **Puppeteer Dependencies:**
   - Tất cả các nền tảng trên đều hỗ trợ Docker với đầy đủ dependencies cho Puppeteer
   - Dockerfile đã được cấu hình sẵn

2. **Thời gian xử lý:**
   - Free tier có thể có giới hạn về thời gian request
   - Nếu download mất nhiều thời gian, có thể cần upgrade plan

3. **Storage:**
   - Files được lưu tạm trong container
   - Sau khi download xong, file sẽ được gửi về client và xóa khỏi server

4. **Memory:**
   - Puppeteer cần nhiều RAM
   - Đảm bảo nền tảng bạn chọn có đủ RAM (tối thiểu 1GB)

## 🔧 Troubleshooting

### Lỗi timeout:
- Tăng timeout trong config.ini
- Kiểm tra giới hạn của free tier

### Lỗi Puppeteer:
- Đảm bảo Dockerfile có đầy đủ dependencies
- Kiểm tra logs để xem lỗi cụ thể

### Lỗi port:
- Đảm bảo PORT environment variable được set đúng
- Railway và Render tự động set PORT, không cần config thủ công

## 📝 Cập nhật sau khi deploy

Sau khi deploy thành công, bạn có thể:
1. Thêm custom domain
2. Setup auto-deploy từ GitHub
3. Monitor logs và metrics
4. Scale up nếu cần

