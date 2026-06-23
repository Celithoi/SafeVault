import { Button } from "./Button";
import { Input } from "./Input";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-900 text-white min-h-[70vh]">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mb-6">
        Safe<span className="text-blue-500">Vault</span>
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
        Armazene e organize seus arquivos com segurança e privacidade total.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center items-center">
        <Input
          type="email"
          placeholder="Digite seu melhor e-mail..."
          className="w-full"
        />
        <Button className="w-full sm:w-auto whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
          Começar
        </Button>
      </div>
    </section>
  );
}
