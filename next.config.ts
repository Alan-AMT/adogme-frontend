/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "images.unsplash.com", // mock data con fotos reales
      "storage.googleapis.com", // cuando conectes el backend
    ],
  },
};

module.exports = nextConfig;
