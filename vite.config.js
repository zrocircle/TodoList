import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ⚠️ GitHub Pages 배포 시 반드시 본인의 레포지토리 이름으로 변경하세요.
  // 예) 레포 이름이 "my-todo-app" 이라면 → base: '/my-todo-app/'
  // 로컬 개발 시에는 '/'로 두거나 이 줄을 주석 처리하세요.
  base: '/SELab-TodoList/',

  build: {
    rollupOptions: {
      output: {
        // Firebase SDK와 앱 코드를 청크로 분리하여 초기 로딩 속도 개선
        // Vite 8 (Rolldown) 에서는 함수 형식만 지원
        manualChunks(id) {
          if (id.includes('firebase/auth'))      return 'firebase-auth'
          if (id.includes('firebase/firestore')) return 'firebase-firestore'
          if (id.includes('firebase'))           return 'firebase-app'
          if (id.includes('react-router-dom'))   return 'react-vendor'
          if (id.includes('react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
        },
      },
    },
  },
})
