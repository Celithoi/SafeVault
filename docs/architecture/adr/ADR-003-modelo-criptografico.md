# ADR-003 --- Modelo Criptográfico

**Status:** 🟢 Approved\
**Versão:** 1.1 consolidada\
**Data original:** 27/07/2026\
**Última revisão consolidada:** 30/08/2026\
**Autor:** Marcelo Henrique Rocha Cardoso\
**Impacto:** Muito Alto

## 1. Contexto

O SafeVault adota Zero-Knowledge para o conteúdo sensível. Criptografia
e descriptografia pertencem ao cliente; o servidor persiste conteúdo
criptografado e metadados operacionais mínimos necessários.

## 2. Decisão

Arquitetura criptográfica modular:

``` text
Master Password
      ↓
   Argon2id
      ↓
Master Material
      ↓
     HKDF
   ↙       ↘
Authentication Key
Wrap Key
      ↓
unwrap / wrap
      ↓
  Vault Key
      ↓
subchaves por finalidade
      ↓
AES-256-GCM
```

Cada material criptográfico possui finalidade específica. Autenticação e
criptografia permanecem separadas.

## 3. Regras Centrais

-   operações criptográficas sensíveis ocorrem no cliente;
-   servidor não recebe plaintext do cofre, Master Password ou Vault Key
    descriptografada;
-   evolução criptográfica é explicitamente versionada;
-   compatibilidade é controlada;
-   material temporário sensível não é persistido;
-   servidor pode conhecer metadados operacionais mínimos
    deliberadamente aprovados.

## 4. ADRs Derivadas

-   ADR-003.1 --- Derivação de Chaves
-   ADR-003.2 --- Vault Key
-   ADR-003.3 --- Criptografia Simétrica
-   ADR-003.4 --- Envelope Criptográfico
-   ADR-003.5 --- AAD
-   ADR-003.6 --- Versionamento Criptográfico
-   ADR-003.7 --- Modelo de Armazenamento
-   ADR-003.8 --- Integridade Global do Cofre (**pendente/deferred**)

## 5. Decisões Formalmente Aprovadas

-   ✅ Zero-Knowledge para conteúdo sensível.
-   ✅ Criptografia/descriptografia no cliente.
-   ✅ Arquitetura criptográfica modular.
-   ✅ Separação de responsabilidades entre chaves.
-   ✅ Servidor persiste ciphertext e apenas metadados operacionais
    mínimos necessários.
-   ✅ Evolução criptográfica deve preservar compatibilidade controlada.
-   ⏸ Freshness, anti-rollback e integridade global permanecem
    dependência explícita da ADR-003.8.
