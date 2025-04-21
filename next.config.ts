// next.config.js
/** @type {import('next').NextConfig} */
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5286/api/:path*',  // për HTTP
      },
    ]
  },
}
