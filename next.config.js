/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['date-fns', 'react-datepicker'],
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig 