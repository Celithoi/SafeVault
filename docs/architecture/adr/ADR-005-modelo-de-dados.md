# ADR-005 --- Modelo de Dados

**Status:** 🟢 Approved\
**Versão:** 1.0\
**Data de aprovação consolidada:** 30/08/2026\
**Autor:** Marcelo Henrique Rocha Cardoso\
**Impacto:** Muito Alto\
**Escopo:** Core Data Model

## 1. Contexto

O SafeVault precisa de um modelo de dados compatível com Zero-Knowledge,
minimização de metadados, criptografia client-side, gestão independente
de conta/cofre e futura evolução sem expandir artificialmente a V1.

Esta ADR define apenas o **Core Data Model**.

Entidades especializadas continuam nos seus domínios:

-   Device / Session → ADR-004;
-   MFA e artefatos de segurança → ADR-002 / ADR-009;
-   AuditEvent → ADR-010;
-   schema físico, índices e ORM → ADR-007.

## 2. Entidades Centrais

``` text
User
  │ owns
  ▼
Vault
  │ contains
  ▼
VaultItem
```

### User

Representa identidade, conta e dados necessários à
autenticação/derivação.

### Vault

Representa o domínio criptográfico do cofre e possui o
`wrappedVaultKey`.

### VaultItem

Representa uma unidade genérica de conteúdo criptografado pertencente ao
Vault.

## 3. Decisões Formalmente Aprovadas

### D01 --- Minimização / Zero-Knowledge

O servidor armazena apenas o necessário para operar. Conteúdo do cofre
não será exposto por conveniência.

> O servidor não deve conhecer dados do conteúdo do cofre que não sejam
> estritamente necessários às suas responsabilidades.

### D02 --- Relação User / Vault

Na V1, cada `User` possui no máximo um `Vault`, mas `User` e `Vault` são
entidades independentes.

Múltiplos Vaults não fazem parte da V1; a arquitetura apenas evita
equiparar estruturalmente `User = Vault`.

### D03 --- Ownership do VaultItem

`VaultItem` pertence a `Vault`, não diretamente a `User`.

Autorização deriva da cadeia:

``` text
User → Vault → VaultItem
```

### D04 --- VaultItem genérico e tipado

`VaultItem` é estruturalmente genérico. O subtipo funcional pertence ao
conteúdo criptografado.

Conceitualmente:

``` text
VaultItem {
  id
  vaultId
  encryptedPayload
  operationalMetadata
}
```

Arquitetura genérica não expande o escopo funcional da V1.

### D05 --- Subtipo funcional criptografado

Tipos como `LOGIN` ou `SECURE_NOTE` permanecem dentro do payload
criptografado.

Servidor não deve conhecer:

-   título;
-   username;
-   password;
-   URL;
-   notas;
-   campos customizados;
-   subtipo funcional.

**Limite:** confidencialidade/integridade AEAD não equivalem a
freshness. Replay/rollback permanece dependência da ADR-003.8.

### D06 --- Payload único por item

Cada `VaultItem` é uma única unidade lógica criptografada/autenticada.

O conteúdo é serializado deterministicamente/canonicamente e
criptografado como um payload AES-256-GCM.

Atualizar qualquer campo de conteúdo recriptografa o payload do item.

### D07 --- Timestamps

Metadados temporais operacionais mínimos podem permanecer visíveis:

-   `createdAt`;
-   `updatedAt`;
-   `deletedAt` quando aplicável.

Timestamps semânticos de conteúdo permanecem criptografados.

### D08 --- Soft Delete / Trash

Exclusão normal utiliza lixeira/soft delete:

``` text
ACTIVE → TRASHED → ACTIVE (restore)
                 ↘ PURGED
```

Conteúdo permanece criptografado durante retenção.

Duração da retenção não é decidida nesta ADR.

### D09 --- Autoridade temporal

Servidor é autoridade dos timestamps operacionais persistentes.

Esses timestamps servem a persistência, lifecycle e sincronização
operacional; **não são prova criptográfica de freshness/anti-rollback**.

### D10 --- itemId client-side

Cliente gera `itemId` antes da criptografia.

O identificador deve ser globalmente único e não sequencial. Formato
exato é decisão posterior.

Servidor valida:

-   formato;
-   autenticação/autorização;
-   ownership;
-   unicidade.

ID imprevisível não substitui controle de acesso.

### D11 --- vaultId client-side

Cliente gera `vaultId` durante inicialização criptográfica do Vault.

Servidor aplica:

-   autorização;
-   unicidade;
-   cardinalidade máxima de um Vault por User na V1.

Regra:

``` text
Identidade de objetos criptográficos → CLIENTE
Política de existência/autorização → SERVIDOR
```

### D12 --- wrappedVaultKey pertence ao Vault

`wrappedVaultKey` pertence a `Vault`, não a `User`.

``` text
User = identidade/conta
Vault = domínio criptográfico
VaultItem = conteúdo criptografado
```

### D13 --- Metadata do Master KDF pertence ao User

`masterKdfSalt`, versão/parâmetros do KDF e dados relacionados à
derivação mestre pertencem a `User`.

Motivo: o KDF está a montante tanto da Authentication Key quanto da Wrap
Key.

Usar nomenclatura:

-   `masterKdfSalt`;
-   `masterKdfParameters`.

Evitar `passwordSalt`.

### D14 --- Lifecycle explícito do User

`User` possui status explícito.

Estados conceituais iniciais suficientes:

-   `PENDING`;
-   `ACTIVE`;
-   `DISABLED`.

Não criar estados adicionais sem necessidade concreta.

Desabilitar conta **não destrói o Vault**.

### D15 --- userId imutável; e-mail alterável

`userId` é identidade persistente e imutável.

E-mail:

-   único;
-   usado para login/contato;
-   alterável mediante fluxo sensível com reautenticação.

Relacionamentos usam `userId`, nunca e-mail.

Recuperação de conta não pode virar recuperação do Vault.

### D16 --- AAD genérico versus itemType criptografado

Para `VaultItem`, AAD utiliza classificação criptográfica genérica:

``` text
domain = safevault:vault-item
cryptoVersion
vaultId
itemId
```

`itemType` funcional permanece exclusivamente dentro do payload
criptografado.

Esta decisão revisa a interpretação anterior da ADR-003.5.

### D17 --- Optimistic Concurrency Control

Cada `VaultItem` possui mecanismo operacional de `revision` para
detectar updates baseados em estado obsoleto e impedir **silent lost
updates**.

Não foram aprovados:

-   merge automático;
-   CRDT;
-   event sourcing;
-   histórico completo;
-   version history recuperável.

`revision` é token/versão operacional atual, não histórico.

Implementação concreta --- integer, ETag, `If-Match` ou equivalente ---
será definida em ADR-006/ADR-007.

## 4. Metadados Operacionais Visíveis

Podem permanecer server-visible quando necessários:

-   `itemId`;
-   `vaultId`;
-   `cryptoVersion`;
-   metadata criptográfica necessária;
-   `createdAt`;
-   `updatedAt`;
-   `deletedAt`;
-   `revision`.

A existência de metadata leakage temporal é reconhecida como trade-off
da V1.

## 5. Segurança e Dependências

### Anti-rollback

`revision`, timestamps, soft delete e AES-GCM/AAD não resolvem sozinhos
rollback de um estado antigo ainda válido.

Dependência: **ADR-003.8 --- Integridade Global do Cofre**.

### authVerifier

`authVerifier` pode pertencer conceitualmente ao domínio de `User`, mas
sua construção criptográfica concreta **não foi resolvida nesta ADR**.

Deve passar por revisão de segurança específica, incluindo resistência a
ataques offline após comprometimento do banco.

### Lifecycles independentes

Lifecycle de `User` e lifecycle de `Vault` são distintos.

`DISABLED`, exclusão da conta e purge/destruição do Vault são eventos
diferentes.

### Account creation

Fluxo conceitual possível:

``` text
Admin cria User
      ↓
PENDING
      ↓
cliente do usuário inicializa
vaultId + Vault Key + wrappedVaultKey
      ↓
ativação conforme fluxo futuro
```

O fluxo concreto será definido em ADR apropriada.

## 6. Fora do Escopo desta ADR

-   schema físico;
-   ORM;
-   índices;
-   constraints concretas;
-   formato exato de UUID/ID;
-   protocolo HTTP de concurrency;
-   duração da lixeira;
-   fluxo final de exclusão de conta;
-   solução de anti-rollback;
-   construção final de `authVerifier`;
-   múltiplos Vaults na V1.

## 7. Cross-check Arquitetural

A ADR-005 foi validada contra ADR-002, ADR-003 e ADR-004.

Resultado:

-   autenticação versus unlock: coerente;
-   Authentication Key versus Wrap Key: coerente;
-   KDF metadata em User: coerente;
-   `wrappedVaultKey` em Vault: coerente;
-   ownership de VaultItem: coerente;
-   sessão autenticada versus cofre desbloqueado: coerente;
-   `userId` estável / e-mail alterável: coerente;
-   lifecycle User versus Vault: coerente;
-   soft delete: coerente;
-   optimistic concurrency: coerente;
-   itemType/AAD: coerente após revisão da ADR-003.5;
-   anti-rollback: dependência explicitamente preservada.

**Nenhum blocker permanece dentro do escopo da ADR-005.**

## 8. Decisões Formalmente Aprovadas --- Resumo

-   ✅ Core Data Model = `User`, `Vault`, `VaultItem`.
-   ✅ V1: no máximo um Vault por User.
-   ✅ VaultItem pertence a Vault.
-   ✅ VaultItem genérico com subtipo funcional criptografado.
-   ✅ Um encrypted payload por item.
-   ✅ Timestamps operacionais mínimos visíveis.
-   ✅ Soft delete/trash.
-   ✅ Servidor é autoridade temporal operacional.
-   ✅ `itemId` client-side.
-   ✅ `vaultId` client-side.
-   ✅ `wrappedVaultKey` pertence ao Vault.
-   ✅ master KDF metadata pertence ao User.
-   ✅ User possui lifecycle explícito.
-   ✅ `userId` imutável e e-mail alterável.
-   ✅ AAD genérico; `itemType` criptografado.
-   ✅ Optimistic Concurrency via `revision`.
-   ⏸ Anti-rollback/freshness permanece ADR-003.8.
