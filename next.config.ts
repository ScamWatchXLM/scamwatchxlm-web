import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained server bundle for the Docker image
  // (see Dockerfile) — omit this if deploying to Vercel, which doesn't need it.
  output: "standalone",
}

export default nextConfig
