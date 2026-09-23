import { Outlet } from "react-router-dom";
import { SideBar } from "../components/SideBar";

export function AppLayout() {
  return (
    // 1. Criamos um container que ocupa a tela inteira e alinha a Sidebar e o Main lado a lado
    <div className="flex h-screen w-screen bg-slate-950 text-white overflow-hidden">
      {/* 2. A Sidebar fica fixa no canto esquerdo (o tamanho dela será controlado dentro do componente) */}
      <SideBar />

      {/* 3. O 'flex-1' faz o main ocupar TODO o espaço restante da tela à direita */}
      {/* O 'overflow-y-auto' garante que se a página for longa, apenas essa área terá barra de rolagem */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-900">
        {/* Espaço confortável para o conteúdo das páginas internas do App */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
