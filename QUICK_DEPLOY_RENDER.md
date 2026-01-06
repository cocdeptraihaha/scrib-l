# 🚀 Quick Start: Deploy lên Render

Hướng dẫn nhanh để deploy trong 5 phút.

## ⚡ Các bước nhanh:

### 1. Đăng nhập Render
👉 https://render.com → Sign in with GitHub

### 2. Tạo Web Service
- Click **"New +"** → **"Web Service"**
- Chọn repository của bạn
- Click **"Connect"**

### 3. Cấu hình (Nếu không dùng render.yaml)

**Nếu Render tự động detect `render.yaml`:**
- ✅ Không cần làm gì thêm, click **"Create Web Service"**

**Nếu cấu hình thủ công:**
- **Name:** `scribd-dl`
- **Environment:** `Docker`
- **Dockerfile Path:** `./Dockerfile`
- **Docker Context:** `.`
- **Plan:** `Free`

### 4. Deploy
- Click **"Create Web Service"**
- Chờ 5-10 phút để build
- ✅ Xong! Nhận URL của bạn

---

## 📝 Checklist trước khi deploy:

- [ ] Code đã được push lên GitHub
- [ ] File `render.yaml` đã có trong repo (hoặc cấu hình thủ công)
- [ ] File `Dockerfile` đã có trong repo
- [ ] File `package.json` có script `server`

---

## 🔗 Sau khi deploy:

URL của bạn sẽ có dạng:
```
https://scribd-dl.onrender.com
```

Test ngay:
- Homepage: `https://scribd-dl.onrender.com`
- Health check: `https://scribd-dl.onrender.com/api/status`

---

## ⚠️ Lưu ý Free Tier:

- **Sleep sau 15 phút** không có traffic
- Request đầu tiên sau khi sleep mất ~30 giây để wake up
- 512MB RAM (có thể không đủ cho Puppeteer với tài liệu lớn)

---

## 🆘 Gặp vấn đề?

Xem chi tiết trong `DEPLOY_RENDER.md` hoặc:
1. Kiểm tra Logs trong Render Dashboard
2. Đảm bảo Dockerfile đúng
3. Kiểm tra environment variables

