/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NOVO: Cor Principal da StafferWork (Azul mais Vivo)
        'sw-blue-primary': '#2563EB', // blue-600

        // NOVO: Cor de Destaque/Ação da StafferWork (Amarelo)
        'sw-yellow-accent': '#FACC15', // yellow-400
      },
    },
  },
  plugins: [],
}