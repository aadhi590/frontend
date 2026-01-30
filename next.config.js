/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig