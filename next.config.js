/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "socialify.git.ci",
      "raw.githubusercontent.com",
      "res.cloudinary.com",
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
