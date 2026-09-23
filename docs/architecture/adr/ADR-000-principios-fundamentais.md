# ADR-000 --- Princípios Fundamentais

**Status:** 🟢 Approved\
**Versão:** 1.0\
**Data:** 31/07/2026\
**Autor:** Marcelo Henrique Rocha Cardoso\
**Impacto:** Máximo\
**Escopo:** Todo o ecossistema SafeVault

## 1. Contexto

Tecnologias, frameworks, bancos de dados e algoritmos poderão evoluir ao
longo da vida do SafeVault. Alguns princípios, entretanto, representam a
identidade do produto e devem permanecer estáveis independentemente da
implementação adotada.

## 2. Problema

Era necessário estabelecer critérios permanentes capazes de orientar
decisões futuras sem acoplar o produto a tecnologias específicas.

## 3. Decisão

O SafeVault adota como fundamentos:

1.  **Propriedade dos dados:** os dados pertencem ao usuário.
2.  **Zero-Knowledge:** o servidor não deverá conhecer o conteúdo
    sensível do cofre.
3.  **Segurança por padrão:** segurança terá prioridade sobre
    conveniência quando houver conflito real.
4.  **Simplicidade:** complexidade somente será adicionada quando
    resolver necessidade concreta.
5.  **Autonomia consciente:** o sistema deve proteger por padrão sem
    remover desnecessariamente o controle do usuário.
6.  **Evolução incremental:** preparar para crescer não significa
    implementar antecipadamente.
7.  **Separação de responsabilidades:** componentes devem possuir
    responsabilidades claramente definidas.
8.  **Independência tecnológica:** princípios arquiteturais não dependem
    permanentemente de uma tecnologia específica.
9.  **Rastreabilidade:** decisões arquiteturais relevantes serão
    registradas em ADR.
10. **Coerência entre documentação e implementação:** a implementação
    deve respeitar as decisões vigentes.

## 4. Consequências

-   ADRs posteriores devem respeitar estes fundamentos.
-   Aumento de complexidade precisa ser justificado.
-   Mudança estrutural incompatível com estes princípios exige revisão
    formal.
-   Decisões temporárias não podem violar princípios permanentes.

## 5. Decisões Formalmente Aprovadas

-   ✅ Os dados pertencem ao usuário.
-   ✅ Segurança terá prioridade sobre conveniência quando necessário.
-   ✅ Simplicidade será preferida sempre que possível.
-   ✅ O sistema evoluirá incrementalmente.
-   ✅ Componentes possuirão responsabilidades bem definidas.
-   ✅ O servidor não conhecerá o conteúdo sensível do cofre.
-   ✅ Toda decisão arquitetural importante será registrada em ADR.
