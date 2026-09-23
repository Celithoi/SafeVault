import { Input } from "./Input";

export function SearchBar() {
  return (
    // 1. Criamos um container com largura máxima para a barra de busca não ficar gigante
    <div className="relative w-full max-w-md">
      {/* 2. Ícone de lupa flutuante posicionado perfeitamente na esquerda */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">
        🔍
      </span>

      {/* 3. Chamamos o seu componente Input, empurrando o texto um pouco para a direita (pl-11) */}
      {/* para ele não passar por cima do emoji de lupa */}
      <Input
        type="text"
        placeholder="Pesquisar pastas ou credenciais..."
        className="w-full pl-11 bg-slate-900/50 border-slate-800/80 focus:border-blue-500/50"
      />
    </div>
  );
}
