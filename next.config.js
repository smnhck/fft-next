/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'franzis-fabelhafte-toertchen.de',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Old category pages → new /stoebern/[category] routes
      { source: '/torten-und-toertchen', destination: '/stoebern/torten-und-toertchen', permanent: true },
      { source: '/hochzeitstorten', destination: '/stoebern/hochzeitstorten', permanent: true },
      { source: '/flaumiges-hefegebaeck', destination: '/stoebern/flaumiges-hefegebaeck', permanent: true },
      { source: '/kuchen-und-muffins', destination: '/stoebern/kuchen-und-muffins', permanent: true },
      { source: '/kuchen-muffins-und-cupcakes', destination: '/stoebern/kuchen-und-muffins', permanent: true },
      { source: '/plaetzchen-kekse-und-kleingebaeck', destination: '/stoebern/plaetzchen-kekse-und-kleingebaeck', permanent: true },
      { source: '/plaetzchen-kekse-und-co', destination: '/stoebern/plaetzchen-kekse-und-kleingebaeck', permanent: true },
      { source: '/cake-pops', destination: '/stoebern/cake-pops', permanent: true },
      // Removed category
      { source: '/eiscremes-und-desserts', destination: '/stoebern', permanent: true },
      // Old cake detail paths
      { source: '/toertchen/:slug', destination: '/stoebern/torten-und-toertchen/:slug', permanent: true },
    ]
  },
}

module.exports = nextConfig
