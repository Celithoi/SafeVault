// 1. Importamos o Link do React Router para fazer a navegação entre as páginas
import { Link } from "react-router-dom";

export function Header() {
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

        {/* Lado Direito: Botões de Navegação Direta */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* Link simples para a página de Login */}
          <Link
            to="/login"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Entrar
          </Link>

          {/* Botão destacado para a página de Cadastro */}
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </header>
  );
}
