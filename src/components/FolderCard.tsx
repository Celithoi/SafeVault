// Definimos o que o Card de Pasta precisa receber para desenhar na tela
type FolderCardProps = {
  nome: string;
  quantidadeItens: number;
};

export function FolderCard({ nome, quantidadeItens }: FolderCardProps) {
  return (
    // Um card com bordas suaves que muda de cor sutilmente quando passamos o mouse (hover)
    <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-xl hover:border-slate-700/60 transition-all cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        {/* Ícone de pasta grande e estilizado */}
        <span className="text-3xl bg-slate-800/60 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-blue-600/10 transition-colors">
          📁
        </span>

        {/* Indicador de quantidade de senhas salvas dentro dela */}
        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-mono">
          {quantidadeItens} {quantidadeItens === 1 ? "item" : "itens"}
        </span>
      </div>

      {/* Nome da Pasta */}
      <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
        {nome}
      </h3>

      <p className="text-xs text-slate-500 mt-1">Pasta de Credenciais</p>
    </div>
  );
}
