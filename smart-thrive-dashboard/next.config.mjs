/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Cung cấp tất cả các tên miền HTTPS
            },
        ],
    },
};

export default nextConfig;