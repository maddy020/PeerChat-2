import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "PeerChat",
        short_name: "p2p",
        description: "A place where you can communicate securely",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        id: "/",
        start_url: "/",
        background_color: "#2a2a2a",
        display: "standalone",
        scope: "/",
        theme_color: "#1f4645",
        display_override: ["fullscreen", "minimal-ui"],
        orientation: "portrait",
        screenshots: [
          {
            src: "/screenshot1.png",
            type: "image/png",
            sizes: "891x872",
            form_factor: "narrow",
          },
          {
            src: "/screenshot2.png",
            type: "image/png",
            sizes: "1920x870",
            form_factor: "wide",
          },
        ],
      },
    }),
  ],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:5173",
  },
});
