export function Benefits() {
  const listaBeneficios = [
    {
      titulo: "Adeus às Senhas Esquecidas",
      descricao:
        "Chega de clicar em 'Esqueci minha senha'. Tenha tudo centralizado em um ambiente seguro e acessível com um clique.",
      badge: "Produtividade",
    },
    {
      titulo: "Privacidade Sob Seu Controle",
      descricao:
        "Nenhum dado é vendido ou compartilhado. Você é o único dono das suas credenciais e chaves de segurança.",
      badge: "Privacidade",
    },
    {
      titulo: "Tranquilidade Diária",
      descricao:
        "Monitore se suas credenciais foram vazadas na internet e durma tranquilo sabendo que seus dados estão protegidos.",
      badge: "Proteção",
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <span className="text-blue-500 font-semibold tracking-wider text-sm uppercase">
            Benefícios Reais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Como o SafeVault muda o seu dia a dia
          </h2>
        </div>

        {/* Lista de Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listaBeneficios.map((beneficio, index) => (
            <div
              key={index}
              className="bg-slate-950/40 border border-slate-800/60 p-8 rounded-xl flex flex-col justify-between"
            >
              <div>
                {/* Uma tag bonitinha (Badge) indicando a categoria */}
                <span className="inline-block bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium mb-4">
                  {beneficio.badge}
                </span>

                <h3 className="text-xl font-semibold mb-3 text-slate-100">
                  {beneficio.titulo}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {beneficio.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
