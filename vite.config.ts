import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({ plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['icons/icon.svg'],workbox:{globPatterns:['**/*.{js,css,html,ico,png,svg,webp,avif,gif,wasm}']},manifest:{name:'TreinAI',short_name:'TreinAI',description:'Seu treino, sua evolução.',theme_color:'#10130f',background_color:'#10130f',display:'standalone',start_url:'/',icons:[{src:'/icons/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any maskable'}]}})] });
