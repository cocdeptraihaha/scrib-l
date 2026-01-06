# Hướng dẫn Upload lên GitHub của bạn

Vì đây là repo của người khác, bạn cần tạo repo mới trên GitHub của bạn và push code lên đó.

## Các bước thực hiện:

### Cách 1: Sử dụng Script Tự động (Khuyến nghị cho Windows)

1. **Tạo repository mới trên GitHub** (xem bước 1 bên dưới)

2. **Chạy script setup:**
   ```powershell
   .\setup-github.ps1
   ```
   Script sẽ hỏi URL repository mới của bạn và tự động setup remote.

3. **Commit và push:**
   ```powershell
   .\commit-and-push.ps1
   ```
   Script sẽ tự động commit và push code lên GitHub.

---

### Cách 2: Thực hiện thủ công

### 1. Tạo repository mới trên GitHub

1. Đăng nhập vào GitHub: https://github.com
2. Click vào dấu **+** ở góc trên bên phải → **New repository**
3. Điền thông tin:
   - **Repository name:** `scribd-dl` (hoặc tên bạn muốn)
   - **Description:** Scribd Document Downloader với Web Interface
   - **Visibility:** Public hoặc Private (tùy bạn)
   - **KHÔNG** tích vào "Initialize with README" (vì bạn đã có code)
4. Click **Create repository**

### 2. Thay đổi remote origin

Sau khi tạo repo, GitHub sẽ hiển thị URL của repo mới. Copy URL đó (ví dụ: `https://github.com/username/scribd-dl.git`)

Chạy các lệnh sau trong terminal:

```bash
# Xóa remote origin cũ
git remote remove origin

# Thêm remote origin mới (thay YOUR_USERNAME và YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Kiểm tra lại
git remote -v
```

### 3. Commit các thay đổi

```bash
# Thêm tất cả các file mới và thay đổi
git add .

# Commit với message mô tả
git commit -m "Add web interface, Docker support, and progress tracking"

# Hoặc commit từng phần nếu muốn:
# git add public/ server.js Dockerfile docker-compose.yml
# git commit -m "Add web interface and server"
# git add DEPLOY*.md railway.json render.yaml
# git commit -m "Add deployment configurations"
```

### 4. Push lên GitHub của bạn

```bash
# Push lên branch main (hoặc master nếu repo cũ dùng master)
git push -u origin main

# Nếu repo cũ dùng master:
# git branch -M main  # Đổi tên branch thành main
# git push -u origin main
```

### 5. Xác nhận

Kiểm tra trên GitHub, bạn sẽ thấy tất cả code đã được upload lên repo của bạn.

---

## Lưu ý quan trọng:

### Giấy phép (License)
Repo gốc sử dụng GPL-3.0 license. Nếu bạn muốn giữ nguyên license:
- Giữ file LICENSE trong repo
- Hoặc thay đổi license nếu muốn

### Attribution (Ghi công)
Nếu bạn muốn ghi công repo gốc, có thể thêm vào README:
```markdown
## Credits
Based on [rkwyu/scribd-dl](https://github.com/rkwyu/scribd-dl)
```

### .gitignore
File `.gitignore` đã được cập nhật để không commit:
- `node_modules/`
- `output/*` (trừ `.gitkeep`)
- Các file tạm và log

---

## Nếu gặp lỗi:

### Lỗi: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Lỗi: "failed to push some refs"
```bash
# Pull code từ repo mới trước (nếu có)
git pull origin main --allow-unrelated-histories

# Sau đó push lại
git push -u origin main
```

### Lỗi: "branch name"
```bash
# Kiểm tra branch hiện tại
git branch

# Nếu là master, đổi thành main
git branch -M main
git push -u origin main
```

---

## Sau khi push thành công:

Bạn có thể:
1. Deploy lên Railway/Render từ repo mới của bạn
2. Chia sẻ repo với người khác
3. Tiếp tục phát triển và commit các thay đổi mới

---

## Script PowerShell có sẵn:

- **`setup-github.ps1`**: Setup remote origin mới
- **`commit-and-push.ps1`**: Commit và push code lên GitHub

Chạy script trong PowerShell:
```powershell
# Cho phép chạy script (chỉ cần làm 1 lần)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Sau đó chạy script
.\setup-github.ps1
.\commit-and-push.ps1
```

