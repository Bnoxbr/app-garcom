/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // COR ATUALIZADA: O novo Azul Marinho Profundo
        'mr-dark-blue': '#020530', 
        
        // Cor de Destaque/Ação: Mantida
        'mr-highlight': '#F03941', 
      },
    },
  },
  plugins: [],
}