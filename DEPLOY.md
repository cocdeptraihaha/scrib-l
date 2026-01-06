# Hướng dẫn Deploy với Docker

## Yêu cầu
- Docker và Docker Compose đã được cài đặt
- Port 3000 chưa được sử dụng

## Cách chạy với Docker Compose

### 1. Build và chạy container
```bash
docker-compose up -d
```

### 2. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

### 3. Dừng container
```bash
docker-compose down
```

### 4. Xem logs
```bash
docker-compose logs -f
```

## Cách chạy với Docker trực tiếp

### 1. Build image
```bash
docker build -t scribd-dl .
```

### 2. Chạy container
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/output:/app/output \
  -v $(pwd)/config.ini:/app/config.ini \
  --name scribd-dl-web \
  --shm-size=2gb \
  scribd-dl
```

### 3. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

### 4. Dừng và xóa container
```bash
docker stop scribd-dl-web
docker rm scribd-dl-web
```

## Chạy không dùng Docker (Development)

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy server
```bash
npm run server
```

### 3. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## Cấu hình

File `config.ini` có thể được chỉnh sửa để thay đổi cấu hình:
- `rendertime`: Thời gian chờ render (ms) cho Scribd
- `output`: Thư mục lưu file đã tải
- `filename`: Tên file output (`title` hoặc ID)

## Lưu ý

- Container cần quyền truy cập vào thư mục `output` để lưu file
- Puppeteer cần shared memory (shm-size) để hoạt động tốt
- Ứng dụng hỗ trợ các URL từ:
  - scribd.com
  - slideshare.net
  - everand.com

