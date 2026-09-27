# ADR-007 — Persistência e Banco de Dados

**Status:** 🟢 Aprovado  
**Data:** 23/09/2026  
**Autor:** Marcelo Henrique Rocha Cardoso  
**Revisado por:** ChatGPT  
**Impacto:** Alto  
**Escopo:** Backend, persistência, modelo físico, concorrência, integridade e evolução do schema

## 1. Contexto

O SafeVault necessita de uma camada de persistência capaz de representar relações fortes entre `User`, `Vault` e `VaultItem`, preservar invariantes estruturais, suportar concorrência e transações e armazenar material criptográfico opaco sem violar o modelo Zero-Knowledge.

O modelo lógico principal foi definido no ADR-005 e os contratos externos da API no ADR-006. Este ADR define as decisões estruturais de persistência da V1, evitando antecipar detalhes de implementação que devem ser decididos durante o planejamento do backend, implementação e medição.

O PostgreSQL também será utilizado como laboratório principal para o desenvolvimento prático de competências transferíveis de Database Engineering, sem transformar necessidades educacionais em requisitos artificiais do produto.

## 2. Problema

É necessário definir:

- o paradigma e SGBD principal;
- representação física de identificadores, textos, timestamps e material criptográfico;
- integridade referencial e constraints;
- concorrência e limites transacionais;
- política inicial de isolamento;
- critérios para indexação;
- representação de exclusão lógica e purga;
- evolução reproduzível do schema;
- premissas mínimas para backup e restauração.

As decisões devem manter coerência com Zero-Knowledge, permitir evolução controlada e evitar complexidade prematura.

## 3. Alternativas Consideradas

Foram consideradas, conforme cada decisão:

- persistência relacional versus armazenamento orientado a documentos;
- PostgreSQL, SQL Server, Oracle Database e MySQL/MariaDB;
- UUID nativo versus representação textual;
- UUIDv4 versus UUIDv7;
- `CASCADE` versus `RESTRICT` para relações centrais;
- `ENUM`, `TEXT + CHECK` e tabelas auxiliares para estados;
- `TEXT`, `JSONB` e `BYTEA` para artefatos criptográficos;
- indexação antecipada versus indexação orientada por workload;
- diferentes níveis de isolamento transacional;
- alterações manuais de schema versus migrations versionadas.

## 4. Decisão

### 4.1 Persistência relacional

O SafeVault V1 utilizará persistência relacional como paradigma principal. Integridade referencial, constraints e transações farão parte das garantias de consistência.

O payload Zero-Knowledge permanece opaco para o servidor e não exige armazenamento orientado a documentos.

### 4.2 SGBD principal

PostgreSQL será o SGBD relacional principal do SafeVault V1.

A escolha considera:

- adequação ao modelo transacional;
- recursos de integridade e concorrência;
- capacidade de otimização e observabilidade;
- operação self-hosted;
- modelo de licenciamento compatível com a evolução do produto.

PostgreSQL também será o ambiente principal de aplicação prática de fundamentos de Database Engineering. SQL Server, Oracle Database e MySQL/MariaDB poderão posteriormente ser usados como ambientes comparativos de laboratório.

Conhecimento específico do PostgreSQL não será requisito arquitetural para outros produtos da Foundry Labs.

### 4.3 Identificadores

`userId`, `vaultId` e `itemId` serão armazenados utilizando o tipo nativo `UUID` do PostgreSQL.

A API continuará representando esses identificadores como strings, conforme ADR-006.

Os identificadores da V1 utilizarão UUIDv4, priorizando geração distribuída simples, IDs não sequenciais e minimização de metadados embutidos. UUIDv7 poderá ser reconsiderado apenas mediante necessidade concreta ou evidência de impacto relevante de persistência.

### 4.4 Integridade referencial

As relações centrais utilizarão `ON DELETE RESTRICT`:

- `vaults.user_id → users.user_id`;
- `vault_items.vault_id → vaults.vault_id`.

A exclusão física de uma entidade pai não deverá destruir implicitamente dados persistentes importantes.

`ON DELETE CASCADE` não é proibido globalmente e poderá ser utilizado futuramente em estruturas estritamente auxiliares e descartáveis quando apropriado.

### 4.5 E-mail e identidade normalizada

A representação original do e-mail será preservada separadamente da identidade utilizada para comparação:

```sql
email            TEXT NOT NULL,
email_normalized TEXT NOT NULL UNIQUE
```

A normalização será conservadora, determinística e centralizada. Não serão aplicadas regras específicas de provedores, como remoção de pontos ou aliases `+`.

A constraint `UNIQUE` do banco será a barreira final contra duplicidade concorrente.

### 4.6 Campos textuais

Campos textuais utilizarão `TEXT` quando não existir limite estrutural ou de domínio significativo.

Não serão introduzidos `VARCHAR(n)` arbitrários por convenção. Limites funcionais, operacionais ou de segurança serão validados na camada apropriada e poderão ser reforçados com `CHECK` quando necessário.

### 4.7 Material criptográfico

Material criptográfico binário será armazenado em `BYTEA`.

Representações textuais como Base64 pertencem ao transporte e não à persistência. Metadados operacionais necessários, como `cryptoVersion`, permanecerão em colunas explicitamente tipadas.

O banco não interpretará semanticamente ciphertexts e não serão criados índices sobre ciphertext sem padrão de acesso que os justifique.

### 4.8 Concorrência por revision

A revisão operacional será persistida como:

```sql
revision BIGINT NOT NULL CHECK (revision >= 1)
```

O valor inicial será `1` e os incrementos serão monotônicos.

A verificação da revisão esperada e seu incremento deverão ocorrer atomicamente na mesma operação de escrita, evitando o padrão `SELECT` seguido de `UPDATE`.

Conceitualmente:

```sql
UPDATE vault_items
SET
    ciphertext = ?,
    nonce = ?,
    tag = ?,
    crypto_version = ?,
    revision = revision + 1,
    updated_at = ?
WHERE item_id = ?
  AND vault_id = ?
  AND revision = ?;
```

Zero linhas afetadas representa conflito de concorrência e deverá ser traduzido pela aplicação para o contrato definido no ADR-006.

`revision` protege concorrência operacional e não constitui mecanismo de frescor criptográfico ou proteção contra rollback.

### 4.9 Timestamps

Timestamps operacionais persistentes serão representados por `TIMESTAMPTZ`.

O ambiente server-side/banco será a autoridade temporal persistente e a API os exporá em ISO 8601 UTC conforme ADR-006.

Conceitualmente:

```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMPTZ NULL
```

`createdAt` será definido na criação. `updatedAt` será atualizado explicitamente nas mutações persistentes relevantes. `deletedAt` será nulo enquanto o recurso estiver ativo, receberá o instante da exclusão lógica e retornará a nulo em uma restauração aplicável.

A V1 não dependerá de triggers genéricas para manutenção automática de `updatedAt` sem necessidade demonstrada.

### 4.10 Estados persistentes

Conjuntos pequenos, estáveis e fechados de estados serão representados preferencialmente por `TEXT` protegido por `CHECK`.

As constraints validarão os valores permitidos, enquanto regras de transição permanecerão responsabilidade da camada de domínio.

Estados conceituais que representam destruição física, como `PURGED`, não exigem necessariamente uma representação persistente após a remoção do registro.

### 4.11 Um Vault por User na V1

A restrição da V1 de no máximo um `Vault` por `User` será reforçada no PostgreSQL por:

```sql
UNIQUE (user_id)
```

em `vaults`, além da `FOREIGN KEY`.

A aplicação permanece responsável pelo fluxo funcional de criação, enquanto o banco protege a invariável inclusive sob concorrência.

Caso uma versão futura introduza múltiplos Vaults por User, essa constraint poderá ser removida ou substituída por migration.

### 4.12 Política de índices

Índices adicionais serão derivados de:

- constraints;
- padrões concretos de acesso;
- evidência de execução.

Não serão criados automaticamente para cada coluna.

O acesso a `VaultItem` por `vaultId` é um padrão conhecido da V1 e deverá possuir suporte de indexação adequado. A composição exata — simples, composta ou parcial — será validada durante implementação utilizando volume representativo e análise de execution plans.

`revision`, timestamps, status e `cryptoVersion` não receberão índices isolados sem necessidade demonstrada.

### 4.13 Limites transacionais

Operações que representem uma única mudança de domínio e envolvam múltiplas escritas dependentes executarão dentro de transação explícita.

Os limites transacionais serão tão curtos quanto possível e não abrangerão processamento ou chamadas externas que não precisem participar da garantia de consistência.

Uma única instrução SQL já atômica não receberá transações artificiais adicionais apenas por convenção.

### 4.14 Isolation level

O SafeVault V1 utilizará `READ COMMITTED`, padrão do PostgreSQL, como isolation level inicial.

Invariantes concorrentes serão protegidas prioritariamente por:

- constraints;
- operações SQL atômicas;
- controle otimista por `revision`;
- limites transacionais adequados.

`REPEATABLE READ`, `SERIALIZABLE`, locking explícito ou outros mecanismos serão introduzidos apenas quando uma invariável concreta ou evidência de concorrência demonstrar necessidade.

### 4.15 Envelope da wrappedVaultKey

O envelope persistente da `wrappedVaultKey` será representado por campos estruturais explicitamente tipados.

Material criptográfico binário será armazenado em `BYTEA`, enquanto metadados necessários, como versão criptográfica, permanecerão em colunas próprias.

O envelope não será persistido como Base64/TEXT ou `JSONB` apenas por conveniência.

Constraints deverão impedir estados estruturalmente incompletos do envelope, respeitando estados legítimos do ciclo de inicialização do Vault.

Nenhum desses campos permitirá ao servidor acessar a Vault Key em plaintext.

### 4.16 Trash e purge

`TRASHED` será um estado persistente e recuperável.

`PURGED` representará remoção física do `VaultItem` da persistência principal.

O período e os critérios de retenção antes da purga serão definidos por política de produto/segurança, não por este ADR.

Soft delete não será tratado como substituto permanente da exclusão física.

Purga deverá ser explícita, autorizada e compatível com as garantias aplicáveis de integridade referencial e auditoria.

A remoção física não constitui, por si só, prova criptográfica contra rollback ou ressurreição de estado antigo; esse problema permanece relacionado ao ADR-003.8.

### 4.17 Migrations e evolução do schema

O schema persistente será evoluído exclusivamente por migrations versionadas e mantidas no repositório.

Alterações estruturais manuais não constituirão fonte de verdade e não poderão substituir migrations.

Migrations serão tratadas como código, submetidas a versionamento e revisão, e deverão permitir a criação reproduzível do schema esperado em novos ambientes.

A ferramenta concreta de migrations será escolhida juntamente com a estratégia de acesso a dados/ORM, sem ser fixada por este ADR.

### 4.18 Backup e restauração

A persistência deverá ser compatível com processos verificáveis de backup e restauração.

Backups serão tratados como ativos sensíveis e deverão preservar as premissas de segurança aplicáveis à persistência principal.

A existência de backup não altera o modelo Zero-Knowledge e não autoriza armazenamento de Master Password, Vault Key em plaintext ou conteúdo descriptografado.

Frequência, retenção, criptografia operacional, RPO/RTO, automação, PITR e infraestrutura concreta serão definidos no ADR de infraestrutura/deploy e em procedimentos operacionais.

A capacidade de restauração deverá ser testada, não apenas presumida.

## 5. Justificativa

As decisões priorizam integridade estrutural, comportamento previsível sob concorrência, simplicidade operacional e evolução controlada.

O banco protege estados estruturalmente impossíveis por meio de tipos, constraints, integridade referencial e atomicidade, sem absorver regras funcionais que pertencem ao domínio.

A estratégia evita tanto um banco passivo, dependente exclusivamente da aplicação para preservar invariantes, quanto um banco excessivamente complexo que concentre lógica de negócio desnecessária.

A adoção de PostgreSQL fornece um ambiente adequado ao SafeVault e simultaneamente um laboratório real para estudo de modelagem, execução de queries, índices, concorrência, MVCC, locking, transactions, statistics, storage, maintenance e troubleshooting.

## 6. Princípios

1. **Persistência representa invariantes vigentes, não funcionalidades hipotéticas futuras.**
2. **O banco protege estrutura; o domínio governa comportamento funcional.**
3. **Representação de transporte não determina representação física.**
4. **Índices são derivados de constraints, workload e evidência.**
5. **Transações protegem unidades atômicas e devem permanecer curtas.**
6. **Maior isolamento não significa automaticamente maior segurança.**
7. **Mudanças de schema são código versionado.**
8. **Backup só é confiável quando a restauração é verificável.**
9. **Zero-Knowledge continua válido em toda a camada de persistência.**
10. **Decisão aprovada não é decisão eterna; é a melhor decisão sustentada pelas evidências disponíveis naquele momento.**

## 7. Consequências

### Positivas

- integridade relacional reforçada no próprio banco;
- proteção contra duplicidades e estados inválidos sob concorrência;
- schema reproduzível;
- separação clara entre domínio, transporte e persistência;
- estratégia explícita de concorrência otimista;
- redução de indexação e complexidade prematuras;
- base adequada para tuning orientado por evidência;
- evolução futura por migrations;
- laboratório prático de Database Engineering.

### Custos e trade-offs

- constraints e migrations exigem disciplina operacional;
- UUIDv4 pode apresentar menor localidade de escrita que identificadores temporalmente ordenados;
- `READ COMMITTED` poderá exigir estratégias específicas em operações futuras mais complexas;
- `TEXT + CHECK` exige migration quando conjuntos fechados de estados mudarem;
- `UNIQUE(vaults.user_id)` precisará ser alterado se multi-vault se tornar requisito real;
- índices específicos permanecem deliberadamente pendentes até existirem workload e medições representativas.

## 8. Fora do Escopo deste ADR

Não são definidos aqui:

- ORM ou query builder;
- biblioteca/ferramenta concreta de migrations;
- connection pooling e tamanho de pool;
- parâmetros de PostgreSQL;
- tuning de autovacuum;
- índices finais além das invariantes já conhecidas;
- infraestrutura concreta de backup;
- frequência e retenção de backup;
- RPO/RTO;
- PITR;
- topologia de deploy;
- replicação;
- alta disponibilidade;
- monitoramento operacional detalhado;
- política exata de retenção de itens em Trash;
- mecanismo criptográfico de proteção global contra rollback.

Esses pontos serão tratados durante Backend Planning, implementação, laboratório de Database Engineering ou ADRs específicos quando houver necessidade concreta.

## 9. ADRs Relacionadas

- **ADR-000 — Princípios Fundamentais**
- **ADR-001 — Arquitetura Geral**
- **ADR-002 — Modelo de Autenticação**
- **ADR-003 — Modelo Criptográfico**
- **ADR-003.8 — Integridade Global do Cofre** — pendente/deferred
- **ADR-004 — Gestão de Sessões**
- **ADR-005 — Modelo de Dados**
- **ADR-006 — Contratos da API**
- **ADR-009 — Segurança da Aplicação** — futuro
- **ADR-010 — Observabilidade e Auditoria** — futuro
- **ADR-011 — Infraestrutura e Deploy** — futuro

## 10. Decisões Formalmente Aprovadas

- **D01 🟢** — Persistência relacional como paradigma principal da V1.
- **D02 🟢** — PostgreSQL como SGBD principal e laboratório principal de Database Engineering.
- **D03 🟢** — Identificadores persistidos utilizando tipo nativo `UUID`.
- **D04 🟢** — UUIDv4 como estratégia de identificadores da V1.
- **D05 🟢** — `ON DELETE RESTRICT` nas relações centrais do modelo.
- **D06 🟢** — E-mail original preservado e identidade normalizada protegida por `UNIQUE`.
- **D07 🟢** — Uso de `TEXT` quando não houver limite estrutural significativo.
- **D08 🟢** — Material criptográfico binário persistido em `BYTEA`.
- **D09 🟢** — `revision BIGINT` positivo, monotônico e atualizado por operação SQL atômica.
- **D10 🟢** — Timestamps persistidos em `TIMESTAMPTZ`, com autoridade temporal server-side.
- **D11 🟢** — Estados pequenos e fechados representados preferencialmente por `TEXT + CHECK`; transições pertencem ao domínio.
- **D12 🟢** — `UNIQUE(vaults.user_id)` reforça a regra de um Vault por User na V1.
- **D13 🟢** — Indexação orientada por constraints, workload e evidência de execution plans.
- **D14 🟢** — Transações explícitas para unidades atômicas multi-write, mantendo limites curtos.
- **D15 🟢** — `READ COMMITTED` como isolation level inicial.
- **D16 🟢** — Envelope da `wrappedVaultKey` persistido em estrutura tipada, com material binário em `BYTEA`.
- **D17 🟢** — `TRASHED` persistente e recuperável; `PURGED` corresponde à remoção física.
- **D18 🟢** — Schema evoluído exclusivamente por migrations versionadas no repositório.
- **D19 🟢** — Backup e restauração devem ser verificáveis e preservar as premissas Zero-Knowledge.

---

> **Discussões são transitórias. Decisões aprovadas são patrimônio técnico.**
