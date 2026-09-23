export function Features() {
  // Criamos uma lista (array) de objetos para não precisar repetir código HTML à toa
  const listaRecursos = [
    {
      titulo: "Criptografia de Ponta",
      descricao:
        "Seus arquivos são protegidos com chaves de segurança avançadas antes mesmo de saírem do seu dispositivo.",
      icone: "🔒",
    },
    {
      titulo: "Organização Inteligente",
      descricao:
        "Crie pastas, categorias e tags customizadas para encontrar qualquer credencial ou documento em segundos.",
      icone: "📁",
    },
    {
      titulo: "Acesso em Qualquer Lugar",
      descricao:
        "Sincronização segura e instantânea para você acessar suas informações direto do celular ou computador.",
      icone: "🌐",
    },
  ];

  return (
    <section className="bg-slate-950 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher o SafeVault?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Segurança não precisa ser complicada. Desenvolvemos a plataforma
            ideal para proteger o que mais importa para você.
          </p>
        </div>

        {/* Grade de Cards (Grid) */}
        {/* O 'grid-cols-1' deixa em 1 coluna no celular. O 'md:grid-cols-3' divide em 3 colunas no computador */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listaRecursos.map((recurso, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-blue-500/50 transition-all duration-300 group"
            >
              {/* Ícone com fundo destacado */}
              <div className="text-3xl bg-slate-800 w-14 h-14 flex items-center justify-center rounded-lg mb-6 group-hover:bg-blue-600/10 transition-colors">
                {recurso.icone}
              </div>

              <h3 className="text-xl font-semibold mb-3 text-slate-100">
                {recurso.titulo}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                {recurso.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
