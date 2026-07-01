import { useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Benefits } from "../components/Benefits";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/AuthModal";

type AuthTab = "login" | "cadastro";

export function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<AuthTab>("login");
  const [prefillEmail, setPrefillEmail] = useState("");

  function openModal(tab: AuthTab) {
    setInitialTab(tab);
    setModalOpen(true);
  }

  function handleStart(email: string) {
    setPrefillEmail(email);
    openModal("cadastro");
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* O Header vai ficar fixo no topo da página, então ele não precisa de um fundo escuro, mas sim transparente para que o Hero apareça por trás dele */}
      <Header
        onOpenLogin={() => openModal("login")}
        onOpenRegister={() => openModal("cadastro")}
      />
      {/* 1º O Hero inicial */}
      <Hero onStart={handleStart} />

      {/* 2º As Features (A cor escura bg-slate-950 vai quebrar o fundo perfeitamente aqui) */}
      <Features />

      {/* 3º Os Benefícios (Volta para o tom bg-slate-900) */}
      <Benefits />

      {/* 4º O Footer */}
      <Footer />

      {modalOpen && (
        <AuthModal
          initialTab={initialTab}
          initialEmail={prefillEmail}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}
