import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.app.json',
  },
};

export default withMDX(config);
