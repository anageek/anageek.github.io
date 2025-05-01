/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '',
  // If you're not using your GitHub username as the repo name, use:
  // basePath: '/your-repo-name',
};

export default nextConfig;
