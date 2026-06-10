type inputProps = {
  placeholder?: string;
};

export function Input({ placeholder }: inputProps) {
  return (
    <input placeholder={placeholder} className="border rounded-md px-4 py-2" />
  );
}
