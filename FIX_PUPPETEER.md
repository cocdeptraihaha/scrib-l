# Fix Puppeteer Error trên Render/Docker

## Vấn đề

Lỗi khi chạy Puppeteer trên Render:
```
Failed to launch the browser process! 
Running as root without --no-sandbox is not supported
```

## Nguyên nhân

Puppeteer cần các flags đặc biệt khi chạy trong môi trường Docker/containerized như Render.

## Giải pháp đã áp dụng

### 1. Cập nhật PuppeteerSg.js
- Tự động detect môi trường Docker/production
- Thêm các flags cần thiết:
  - `--no-sandbox`
  - `--disable-setuid-sandbox`
  - `--disable-dev-shm-usage`
  - `--disable-accelerated-2d-canvas`
  - `--no-first-run`
  - `--no-zygote`
  - `--disable-gpu`

### 2. Cập nhật Dockerfile
- Thêm `ENV DOCKER=true`
- Tăng shared memory cho Puppeteer

### 3. Cập nhật render.yaml
- Thêm environment variable `DOCKER=true`

## Cách deploy lại

Sau khi fix, bạn cần:

1. **Commit các thay đổi:**
   ```bash
   git add .
   git commit -m "Fix Puppeteer for Docker/Render environment"
   git push origin main
   ```

2. **Render sẽ tự động deploy lại** (nếu auto-deploy bật)
   - Hoặc manual trigger deploy từ Render Dashboard

3. **Kiểm tra logs** sau khi deploy để đảm bảo không còn lỗi

## Kiểm tra

Sau khi deploy, test lại:
- Truy cập ứng dụng
- Thử download một document
- Kiểm tra logs trong Render Dashboard

Nếu vẫn còn lỗi, kiểm tra:
- Logs trong Render Dashboard
- Đảm bảo environment variables đã được set đúng
- Đảm bảo Dockerfile đã được build lại với các thay đổi mới

