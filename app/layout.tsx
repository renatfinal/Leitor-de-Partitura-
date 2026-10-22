import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export const viewport: Viewport = {
  themeColor: '#4a2511',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Leitura de Partitura | Jogo Interativo Musical',
  description:
    'Treine a leitura de notas na pauta com feedback sonoro imediato, claves de Sol, Fá e Dó, modos de velocidade e medição de precisão.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Partituras',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Leitura de Partitura | Jogo Interativo Musical',
    description:
      'Treine a leitura de notas na pauta com feedback sonoro imediato, claves de Sol, Fá e Dó, modos de velocidade e medição de precisão.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leitura de Partitura | Jogo Interativo Musical',
    description:
      'Treine a leitura de notas na pauta com feedback sonoro imediato, claves de Sol, Fá e Dó, modos de velocidade e medição de precisão.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className="antialiased bg-[#2a1a10] text-slate-100 min-h-screen selection:bg-amber-500 selection:text-white"
        suppressHydrationWarning
      >
        <ServiceWorkerRegister />
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
