import { SearchBar } from "../components/SearchBar";
import { FolderCard } from "../components/FolderCard";
import { CredentialCard } from "../components/CredentialCard";

export function DashboardPage() {
  // Simulando dados que viriam de um banco de dados (Mocks)
  const mockPastas = [
    { nome: "Trabalho", quantidadeItens: 8 },
    { nome: "Finanças", quantidadeItens: 3 },
    { nome: "Redes Sociais", quantidadeItens: 12 },
    { nome: "Pessoal", quantidadeItens: 5 },
  ];

  const mockCredenciais = [
    { servico: "GitHub", usuario: "marcelo.dev", url: "github.com" },
    { servico: "Netflix", usuario: "marcelo@email.com", url: "netflix.com" },
    { servico: "Banco Inter", usuario: "marcelo.silva", url: "inter.co" },
    {
      servico: "Google Account",
      usuario: "marcelo.cloud@gmail.com",
      url: "google.com",
    },
    {
      servico: "Spotify Family",
      usuario: "marcelo@email.com",
      url: "spotify.com",
    },
    {
      servico: "Amazon Web Services",
      usuario: "aws_marcelo",
      url: "://amazon.com",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Topo: Título da Página + Barra de Pesquisa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
            Meu Cofre
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie suas pastas e credenciais com segurança.
          </p>
        </div>

        {/* Renderiza a SearchBar que criamos */}
        <SearchBar />
      </div>

      {/* 2. Seção de Pastas (Folders) */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono mb-4">
          Pastas Recentes
        </h2>

        {/* Grade responsiva para as pastas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockPastas.map((pasta, index) => (
            <FolderCard
              key={index}
              nome={pasta.nome}
              quantidadeItens={pasta.quantidadeItens}
            />
          ))}
        </div>
      </div>

      {/* 3. Seção de Credenciais (Logins) */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono mb-4">
          Todas as Credenciais
        </h2>

        {/* Grade responsiva para as senhas (3 colunas no PC) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCredenciais.map((item, index) => (
            <CredentialCard
              key={index}
              servico={item.servico}
              usuario={item.usuario}
              url={item.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
