'use client';

import React, { useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, Check, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  // Hide button if already installed or in standalone mode
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        // User cancelled prompt
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Browser didn't fire beforeinstallprompt yet or standard browser menu required
      setShowGenericModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Instalar aplicativo para jogar offline"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 shadow-sm backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        <span>Instalar App</span>
      </button>

      {/* iOS Safari Installation Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-amber-900/40 text-stone-900"
              style={{
                background: 'linear-gradient(180deg, #fdfbf7 0%, #f4ede1 100%)',
              }}
            >
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-200/50 text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900">Instalar no iPhone / iPad</h3>
                  <p className="text-xs text-stone-500">Adicione à tela inicial em 3 passos</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-700 my-4 bg-amber-50/80 p-4 rounded-xl border border-amber-200/60">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Toque no botão <Share2 className="w-4 h-4 inline text-blue-600 align-text-bottom mx-1" />
                    <strong>Compartilhar</strong> na barra inferior do Safari.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    Role para baixo e selecione{' '}
                    <PlusSquare className="w-4 h-4 inline text-stone-700 align-text-bottom mx-1" />
                    <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Toque em <strong>&ldquo;Adicionar&rdquo;</strong> no canto superior direito para confirmar.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl font-bold bg-amber-700 hover:bg-amber-800 text-white text-sm shadow transition cursor-pointer"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generic Browser / Desktop Guide Modal */}
      <AnimatePresence>
        {showGenericModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-amber-900/40 text-stone-900"
              style={{
                background: 'linear-gradient(180deg, #fdfbf7 0%, #f4ede1 100%)',
              }}
            >
              <button
                type="button"
                onClick={() => setShowGenericModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-200/50 text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900">Instalar Leitura de Partitura</h3>
                  <p className="text-xs text-stone-500">Acesse como um aplicativo nativo</p>
                </div>
              </div>

              <p className="text-sm text-stone-600 mb-4">
                Você pode instalar este app no seu navegador (Chrome, Edge, Brave ou Firefox) clicando no ícone de instalação (computadorzinho ou seta) localizado na barra de endereço ou no menu do navegador (<strong>&ldquo;Instalar aplicativo&rdquo;</strong>).
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Funciona 100% offline após instalado!</span>
              </div>

              <button
                type="button"
                onClick={() => setShowGenericModal(false)}
                className="w-full py-2.5 rounded-xl font-bold bg-amber-700 hover:bg-amber-800 text-white text-sm shadow transition cursor-pointer"
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
