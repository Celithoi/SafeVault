import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Benefits } from "../components/Benefits";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* O Header vai ficar fixo no topo da página, então ele não precisa de um fundo escuro, mas sim transparente para que o Hero apareça por trás dele */}
      <Header />
      {/* 1º O Hero inicial */}
      <Hero />

      {/* 2º As Features (A cor escura bg-slate-950 vai quebrar o fundo perfeitamente aqui) */}
      <Features />

      {/* 3º Os Benefícios (Volta para o tom bg-slate-900) */}
      <Benefits />

      {/* 4º O Footer */}
      <Footer />
    </main>
  );
}
