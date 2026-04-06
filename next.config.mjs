/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',

  typescript: {
      ignoreBuildErrors: true,
    },

  eslint: {
    ignoreDuringBuilds: true,
  },

  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'img.rocket.new',
      },
      {
        protocol: 'https',
        hostname: 'lenjdfecjkywlduolark.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'thesomerset.com.mv',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/homepage',
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
