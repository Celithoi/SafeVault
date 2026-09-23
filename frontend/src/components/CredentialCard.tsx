// Definimos o que o Card de Credencial precisa receber para desenhar na tela
type CredentialCardProps = {
  servico: string; // Ex: Netflix, Google, Github
  usuario: string; // Ex: marcelo@email.com
  url: string; // Ex: github.com
};

export function CredentialCard({ servico, usuario, url }: CredentialCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between hover:border-slate-700/60 transition-all group">
      {/* Topo do Card: Ícone Genérico + Nome do Serviço */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-800/60 rounded-lg flex items-center justify-center text-lg font-bold text-blue-500 group-hover:bg-blue-600/10 transition-colors">
            {servico.charAt(0).toUpperCase()}{" "}
            {/* Pega a primeira letra do serviço */}
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
              {servico}
            </h4>
            <p className="text-xs text-slate-500 truncate">{url}</p>
          </div>
        </div>

        {/* Meio do Card: Usuário / E-mail */}
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/40 mb-4">
          <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider mb-0.5">
            Usuário
          </span>
          <p className="text-sm text-slate-300 font-medium truncate select-all">
            {usuario}
          </p>
        </div>
      </div>

      {/* Base do Card: Ações Simuladas */}
      <div className="flex gap-2 border-t border-slate-800/60 pt-3 mt-2">
        <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5">
          🔑 Copiar Senha
        </button>
        <button className="px-3 py-2 bg-slate-800/40 hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg transition-colors">
          🔗
        </button>
      </div>
    </div>
  );
}
