import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  turbopack: { root: __dirname },
};

export default config;
