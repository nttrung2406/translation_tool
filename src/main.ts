import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

declare global {
  interface Window {
    Office: typeof Office;
  }
}

if (typeof window.Office === 'undefined') {
  console.error('Office.js is not loaded');
} else {
  try {
    window.Office.onReady(() => {
      const app = createApp(App)
      app.mount('#app')
    })
  } catch (error) {
    console.error('Error initializing Office.js:', error)
  }
}
