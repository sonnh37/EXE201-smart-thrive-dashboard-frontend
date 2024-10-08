# Giai đoạn 1: Cài đặt dependencies
FROM node:18-alpine AS deps

WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Giai đoạn 2: Build ứng dụng Next.js
FROM node:18-alpine AS builder

WORKDIR /app

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Sao chép dependencies từ giai đoạn trước
COPY --from=deps /app/node_modules ./node_modules

# Build ứng dụng Next.js
RUN npm run build

# Giai đoạn 3: Tạo image cho production
FROM node:18-alpine AS runner

WORKDIR /app

# Sao chép kết quả build từ giai đoạn builder
COPY --from=builder /app/ ./

# Cấu hình biến môi trường (có thể thêm nếu cần)
ENV NODE_ENV=production
ENV PORT=3000

# Expose cổng mà ứng dụng Next.js sẽ chạy
EXPOSE 3000

# Chạy ứng dụng Next.js
CMD ["npm", "start"]
