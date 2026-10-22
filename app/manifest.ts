import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Leitura de Partitura',
    short_name: 'Partituras',
    description:
      'Aplicativo e jogo interativo para treino e leitura de notas na partitura com som real, claves de Sol, Fá e Dó, e 100% de funcionamento offline.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#2a1306',
    theme_color: '#4a2511',
    orientation: 'portrait',
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
