# Script để setup GitHub repository mới
# Chạy script này sau khi đã tạo repo mới trên GitHub

Write-Host "=== Setup GitHub Repository ===" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra xem đã có remote origin chưa
$currentRemote = git remote get-url origin 2>$null
if ($currentRemote) {
    Write-Host "Remote origin hiện tại: $currentRemote" -ForegroundColor Yellow
    Write-Host ""
    $remove = Read-Host "Bạn có muốn thay đổi remote origin? (y/n)"
    if ($remove -eq "y" -or $remove -eq "Y") {
        git remote remove origin
        Write-Host "Đã xóa remote origin cũ" -ForegroundColor Green
    } else {
        Write-Host "Hủy bỏ. Vui lòng chạy lại script nếu muốn tiếp tục." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "Nhập thông tin repository mới của bạn:" -ForegroundColor Cyan
Write-Host "Ví dụ: https://github.com/username/scribd-dl.git" -ForegroundColor Gray
$newRepoUrl = Read-Host "GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($newRepoUrl)) {
    Write-Host "URL không hợp lệ!" -ForegroundColor Red
    exit
}

# Thêm remote mới
Write-Host ""
Write-Host "Đang thêm remote origin mới..." -ForegroundColor Yellow
git remote add origin $newRepoUrl

# Kiểm tra lại
Write-Host ""
Write-Host "Remote origin mới:" -ForegroundColor Cyan
git remote -v

Write-Host ""
Write-Host "=== Bước tiếp theo ===" -ForegroundColor Cyan
Write-Host "1. Chạy: git add ." -ForegroundColor Yellow
Write-Host "2. Chạy: git commit -m 'Add web interface and deployment configs'" -ForegroundColor Yellow
Write-Host "3. Chạy: git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "Hoặc chạy script tự động: .\commit-and-push.ps1" -ForegroundColor Green

