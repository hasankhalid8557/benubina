/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com'],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['breezy-pots-see.loca.lt', 'localhost:3000'],
        },
    },
}

export default nextConfig
