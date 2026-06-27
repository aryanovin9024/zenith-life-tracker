import { defineConfig } from '@vite-pwa/assets-generator/config'

// Generate PWA / iOS icons from the full-bleed source (ink background already
// baked in, so padding stays 0 and the Apple icon doesn't get a white border).
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
    },
    maskable: {
      sizes: [512],
      padding: 0,
      resizeOptions: { background: '#131315' },
    },
    apple: {
      sizes: [180],
      padding: 0,
      resizeOptions: { background: '#131315' },
    },
  },
  images: ['public/app-icon.svg'],
})
