import { Link } from "react-router-dom";

export function SideBar() {
  return (
    // 1. Definimos uma largura fixa (w-64 = 256px), altura total da tela e cor de fundo escura
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-900 flex flex-col p-6">
      {/* Logotipo ou Nome do App fixo no topo da Sidebar */}
      <div className="mb-10 px-2">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Safe<span className="text-blue-500">Vault</span>
        </h2>
        <span className="text-[10px] text-slate-500 font-mono block mt-1 uppercase tracking-widest">
          Área Segura
        </span>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/app"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span>📊</span> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/app/folders"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span>📁</span> Folders
            </Link>
          </li>
          <li>
            <Link
              to="/app/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span>👤</span> Profile
            </Link>
          </li>
          <li>
            <Link
              to="/app/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span>⚙️</span> Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* Rodapé da Sidebar: Botão Sair */}
      <div className="border-t border-slate-900 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <span>🚪</span> Sair
        </Link>
      </div>
    </aside>
  );
}
