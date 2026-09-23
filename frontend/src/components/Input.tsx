// Usamos 'import type' para indicar que é apenas uma tipagem do React
import type { ComponentPropsWithoutRef } from "react";

//Em vez de uma interface vazia, criamos um 'type' que recebe o tipo do React.
// Isso elimina o aviso do ESLint e mantém o código limpo.
type InputProps = ComponentPropsWithoutRef<"input">;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className || ""}`}
    />
  );
}
