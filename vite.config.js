import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- AGREGA ESTA SECCIÓN ---
  server: {
    proxy: {
      // Cualquier petición que empiece con '/api'
      // será redirigida a tu backend.
      "/api": {
        target: "http://localhost:5265", // La URL de tu backend .NET
        changeOrigin: true, // Necesario para que el backend acepte la petición
        secure: false, // Ignora errores de certificado autofirmado (HTTPS local)
      },
    },
  },
  // --- FIN DE LA SECCIÓN ---
});