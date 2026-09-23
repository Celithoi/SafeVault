# ADR-001 --- Arquitetura Geral

**Status:** 🟢 Approved\
**Versão:** 1.1\
**Data original:** 27/07/2026\
**Última revisão consolidada:** 30/08/2026\
**Autor:** Marcelo Henrique Rocha Cardoso\
**Impacto:** Muito Alto\
**Escopo:** Plataforma, Backend, API e clientes oficiais

## 1. Contexto

O SafeVault evoluiu de um cofre pessoal para a visão de um gerenciador
de senhas self-hosted, com controle dos dados pelo usuário e
possibilidade de múltiplos clientes oficiais.

## 2. Problema

Era necessário evitar que o backend fosse construído exclusivamente em
função do frontend Web, proteger o escopo da V1 e permitir evolução
futura sem antecipar funcionalidades.

## 3. Alternativas Consideradas

-   **A --- Aplicação exclusivamente Web:** menor complexidade inicial,
    porém maior acoplamento e risco de refatorações futuras.
-   **B --- Arquitetura API First preparada para múltiplos clientes:**
    maior disciplina inicial, porém contratos e regras compartilháveis.

## 4. Decisão

Foi adotada a **Alternativa B**.

O SafeVault será:

-   self-hosted;
-   API First;
-   preparado para múltiplos clientes;
-   desenvolvido incrementalmente;
-   compatível com o modelo Zero-Knowledge.

Ordem evolutiva planejada:

1.  Aplicação Web;
2.  Extensão Chrome;
3.  Aplicativo Android.

Apenas a Aplicação Web pertence ao escopo de implementação da V1.

## 5. Princípios

-   API como contrato central, independente da interface.
-   Backend independente do cliente Web.
-   Separação entre interface, regras de negócio, autenticação,
    criptografia e persistência.
-   Reutilização de contratos e comportamentos centrais.
-   Privacidade por arquitetura.
-   Complexidade somente mediante necessidade concreta.
-   Preparação para evolução sem implementação prematura.

## 6. Limites da V1

Ficam fora da V1, entre outros:

-   Extensão Chrome;
-   Aplicativo Android;
-   funcionamento offline;
-   cache persistente do cofre no navegador;
-   funcionalidades corporativas avançadas;
-   gerenciamento especializado de certificados, chaves SSH e segredos
    de infraestrutura.

## 7. Decisões Formalmente Aprovadas

-   ✅ SafeVault será self-hosted.
-   ✅ SafeVault seguirá API First.
-   ✅ Backend não será construído exclusivamente para a Web.
-   ✅ Aplicação Web será o primeiro e único cliente da V1.
-   ✅ Extensão Chrome e Android são evolução posterior.
-   ✅ Arquitetura será preparada para Zero-Knowledge.
-   ✅ Preparação arquitetural não autoriza implementação antecipada.
-   ✅ Complexidade exige necessidade concreta.
