export function Footer() {
  // Pegamos o ano atual automaticamente via JavaScript para o footer nunca ficar desatualizado
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Lado Esquerdo: Marca e Copyright */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-slate-400 mb-1">
            Safe<span className="text-blue-500">Vault</span>
          </p>
          <p className="text-xs">
            &copy; {anoAtual} SafeVault. Todos os direitos reservados.
          </p>
        </div>

        {/* Lado Direito: Links Fictícios de Termos/Políticas */}
        <div className="flex gap-6 text-xs font-medium">
          <a href="#" className="hover:text-slate-300 transition-colors">
            Termos de Uso
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Suporte
          </a>
        </div>
      </div>
    </footer>
  );
}
