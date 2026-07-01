import React, { useState, useRef, useEffect } from "react";

type AuthTab = "login" | "cadastro";

interface AuthModalProps {
  initialTab?: AuthTab;
  initialEmail?: string;
  onClose: () => void;
}

/**
 * AuthModal
 *
 * Uso no seu Navbar/Landing:
 *
 *   const [modalOpen, setModalOpen] = useState(false);
 *   const [initialTab, setInitialTab] = useState<AuthTab>('login');
 *
 *   <button onClick={() => { setInitialTab('login'); setModalOpen(true); }}>Entrar</button>
 *   <button onClick={() => { setInitialTab('cadastro'); setModalOpen(true); }}>Criar Conta</button>
 *
 *   {modalOpen && (
 *     <AuthModal
 *       initialTab={initialTab}
 *       initialEmail={prefillEmail}
 *       onClose={() => setModalOpen(false)}
 *     />
 *   )}
 */
export function AuthModal({
  initialTab = "login",
  initialEmail = "",
  onClose,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora da caixa
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Fecha com ESC (bom pra acessibilidade)
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Caixa do modal */}
      <div
        ref={modalRef}
        className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
      >
        {/* Abas Login / Criar Conta */}
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`py-3 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "bg-slate-800 text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200 border-b border-slate-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cadastro")}
            className={`py-3 text-sm font-semibold transition-colors ${
              activeTab === "cadastro"
                ? "bg-slate-800 text-white border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200 border-b border-slate-700"
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {activeTab === "login" ? (
            <LoginForm />
          ) : (
            <CadastroForm initialEmail={initialEmail} />
          )}
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Email</label>
        <input
          type="email"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="voce@exemplo.com"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Senha</label>
        <input
          type="password"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 hover:bg-blue-500 transition-colors py-2 text-sm font-semibold text-white"
      >
        Entrar
      </button>
      <p className="text-center text-xs text-slate-500 hover:text-slate-300 cursor-pointer">
        Esqueci minha senha
      </p>
    </form>
  );
}

interface CadastroFormProps {
  initialEmail?: string;
}

function CadastroForm({ initialEmail = "" }: CadastroFormProps) {
  // Controlado, pré-preenchido com o que a pessoa digitou no Hero.
  // Continua editável caso ela queira corrigir o email aqui dentro.
  const [email, setEmail] = useState(initialEmail);

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Nome</label>
        <input
          type="text"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="Seu nome"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="voce@exemplo.com"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Senha</label>
        <input
          type="password"
          className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 hover:bg-blue-500 transition-colors py-2 text-sm font-semibold text-white"
      >
        Criar Conta
      </button>
    </form>
  );
}
