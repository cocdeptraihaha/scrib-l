# Script để commit và push lên GitHub
# Chạy script này sau khi đã setup remote origin

Write-Host "=== Commit và Push lên GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra remote origin
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "Lỗi: Chưa có remote origin!" -ForegroundColor Red
    Write-Host "Vui lòng chạy script setup-github.ps1 trước" -ForegroundColor Yellow
    exit
}

Write-Host "Remote origin: $remoteUrl" -ForegroundColor Green
Write-Host ""

# Kiểm tra branch hiện tại
$currentBranch = git branch --show-current
Write-Host "Branch hiện tại: $currentBranch" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra có thay đổi không
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Không có thay đổi nào để commit!" -ForegroundColor Yellow
    Write-Host "Bạn có muốn push code hiện tại lên GitHub không? (y/n)" -ForegroundColor Cyan
    $push = Read-Host
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host ""
        Write-Host "Đang push lên GitHub..." -ForegroundColor Yellow
        git push -u origin $currentBranch
        Write-Host "Hoàn thành!" -ForegroundColor Green
    }
    exit
}

# Hiển thị các thay đổi
Write-Host "Các file đã thay đổi:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Xác nhận
$confirm = Read-Host "Bạn có muốn commit và push các thay đổi này? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Hủy bỏ." -ForegroundColor Yellow
    exit
}

# Add tất cả các file
Write-Host ""
Write-Host "Đang thêm các file..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Đang commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Nhập commit message (hoặc Enter để dùng message mặc định)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Add web interface, Docker support, and progress tracking"
}

git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi commit!" -ForegroundColor Red
    exit
}

Write-Host "Commit thành công!" -ForegroundColor Green
Write-Host ""

# Kiểm tra branch và push
Write-Host "Đang push lên GitHub..." -ForegroundColor Yellow

# Nếu branch là master, đổi thành main
if ($currentBranch -eq "master") {
    Write-Host "Đang đổi tên branch từ master sang main..." -ForegroundColor Yellow
    git branch -M main
    $currentBranch = "main"
}

git push -u origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Hoàn thành! ===" -ForegroundColor Green
    Write-Host "Code đã được push lên: $remoteUrl" -ForegroundColor Cyan
    Write-Host "Branch: $currentBranch" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Lỗi khi push!" -ForegroundColor Red
    Write-Host "Có thể bạn cần pull code trước:" -ForegroundColor Yellow
    Write-Host "git pull origin $currentBranch --allow-unrelated-histories" -ForegroundColor Gray
}

