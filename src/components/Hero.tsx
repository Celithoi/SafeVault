import { Button } from "./Button";
import { Input } from "./Input";

export function Hero() {
  return (
    <section>
      <h1>SafeVault</h1>

      <p>Armazene e organize seus arquivos com segurança.</p>

      <Input />

      <Button>Começar</Button>
    </section>
  );
}
