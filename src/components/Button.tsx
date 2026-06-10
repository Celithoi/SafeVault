type ButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function Button({ children, className }: ButtonProps) {
  return (
    <button className={`px-4 py-2 rounded-md border ${className ?? ""}`}>
      {children}
    </button>
    // px-4       → espaçamento horizontal
    // py-2       → espaçamento vertical
    // rounded-md → bordas arredondadas
    // border     → borda visível
  );
}
