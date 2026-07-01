interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md border ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
    // px-4       → espaçamento horizontal
    // py-2       → espaçamento vertical
    // rounded-md → bordas arredondadas
    // border     → borda visível
  );
}
