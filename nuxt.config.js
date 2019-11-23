
export default {
  mode: 'spa',
  head: {
    title: 'BotChat',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'NKO 2019 project by WumDev. A chat bot capable of a lot.' },
      { property: 'og:image', content: '/botchat.png'}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [
    '@/assets/css/animate.css'
  ],
  plugins: [],
  buildModules: [
    '@nuxtjs/tailwindcss',
  ],
  modules: [],
  build: {
    extend (config, ctx) {}
  }
}
