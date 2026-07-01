// 1. Importamos o Link do React Router para fazer a navegação entre as páginas
import { Link } from "react-router-dom";

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export function Header({ onOpenLogin, onOpenRegister }: HeaderProps) {
  return (
    <header className="bg-slate-950 border-b border-slate-900 text-white px-6 py-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Lado Esquerdo: Logotipo que volta para a Landing Page se clicado */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight hover:opacity-90"
        >
          Safe<span className="text-blue-500">Vault</span>
        </Link>

        {/* Lado Direito: Botões que abrem o AuthModal */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* Abre o modal já na aba de Login */}
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Entrar
          </button>

          {/* Abre o modal já na aba de Criar Conta */}
          <button
            type="button"
            onClick={onOpenRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Criar Conta
          </button>
        </div>
      </div>
    </header>
  );
}
