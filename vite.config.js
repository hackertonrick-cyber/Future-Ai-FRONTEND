import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  // Load env variables based on current mode
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [vue()],
    build: {
      outDir: 'dist',
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vuetify')) return 'vuetify'
              if (id.includes('fontawesome')) return 'fontawesome'
              if (id.includes('pinia')) return 'pinia'
              if (id.includes('vue')) return 'vue'
              if (id.includes('socket.io')) return 'socketio'
              return 'vendor'
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT || '5173', 10),
      proxy: {
        '/socket.io': {
          target: env.VITE_SOCKET_API_URL || 'http://localhost:5000',
          ws: true,
          changeOrigin: true,
          secure: false, // set true only if you have valid SSL cert
        },
      },
    },
    define: {
      'process.env': env, // ✅ exposes env vars to Vite context
    },
  })
}
