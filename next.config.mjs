/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true, // 如果是永久重定向，将其设置为 true
            },
        ];
    },
};

export default nextConfig;
