import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leitura de Partitura | Jogo Interativo Musical',
  description: 'Treine a leitura de notas na pauta com feedback sonoro imediato, claves de Sol, Fá e Dó, modos de velocidade e medição de precisão.',
  openGraph: {
    title: 'Leitura de Partitura | Jogo Interativo Musical',
    description: 'Treine a leitura de notas na pauta com feedback sonoro imediato, claves de Sol, Fá e Dó, modos de velocidade e medição de precisão.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leitura de Partitura | Jogo Interativo Musical',
    description: 'Treine a leitura de notas na pauta com feedback sonoro imediato, claves de Sol, Fá e Dó, modos de velocidade e medição de precisão.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#2a1a10] text-slate-100 min-h-screen selection:bg-amber-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
