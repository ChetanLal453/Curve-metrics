/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // disable if you want faster dev reloads
  images: {
    unoptimized: true, // keeps image loading simple in dev
  },
  // Fast Refresh is enabled by default in Next.js 13+
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize for faster hot reloading
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named', // helps HMR reload only updated modules
        removeAvailableModules: false, // improves hot reloading
        removeEmptyChunks: false, // improves hot reloading
        splitChunks: false, // disable code splitting in dev for faster reloads
      }

      // Balanced watch options for stable development
      config.watchOptions = {
        poll: 800, // Balanced polling interval
        aggregateTimeout: 250, // Reasonable delay before rebuild
        ignored: ['**/node_modules', '**/.next'],
      }
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/page-editor',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
