# ADR-006 — Contratos da API

**Status:** 🟢 Aprovado  
**Versão:** 1.0  
**Data:** 23/09/2026  
**Autor:** Marcelo Henrique Rocha Cardoso  
**Revisado por:** ChatGPT  
**Impacto:** Alto  
**Escopo:** API, Backend, Clientes Web, Extensão Chrome e Android

## 1. Contexto

O SafeVault adota arquitetura API First, modelo Zero-Knowledge para o conteúdo sensível do cofre e separação explícita entre autenticação da conta e desbloqueio do Vault. Os ADRs anteriores definiram o modelo criptográfico, gestão de sessões e o modelo de dados central composto por `User`, `Vault` e `VaultItem`.

O ADR-005 também estabeleceu `revision` como mecanismo de concorrência otimista, mantendo para este ADR a definição concreta de como esse mecanismo atravessa o contrato HTTP.

Este ADR define o contrato externo da API V1 sem escolher framework backend, ORM, banco de dados ou tecnologia específica de implementação.

## 2. Problema

A plataforma precisa de um contrato de API previsível, seguro e comum aos diferentes clientes, capaz de:

- representar recursos e operações de domínio de forma consistente;
- preservar o modelo Zero-Knowledge;
- controlar concorrência sem sobrescritas silenciosas;
- padronizar autenticação, autorização, reautenticação, erros e respostas;
- permitir evolução futura sem acoplar o contrato a detalhes prematuros de implementação.

## 3. Alternativas Consideradas

Foram consideradas, entre outras:

- REST/HTTP, RPC e GraphQL;
- versionamento por URL, headers ou ausência de versão explícita;
- `PUT` e `PATCH` para atualização de itens;
- Vault implícito ou explícito nas URLs;
- paginação imediata ou carregamento integral na V1;
- cookies de sessão ou Bearer tokens;
- idempotência genérica por chave ou uso do `itemId` gerado pelo cliente.

As alternativas foram avaliadas considerando simplicidade, clareza contratual, segurança, compatibilidade multiplataforma e aderência aos ADRs anteriores.

## 4. Decisão

### 4.1 Estilo e versionamento

A API V1 utilizará HTTP com contratos predominantemente RESTful e orientados a recursos. Operações de domínio que não se encaixem naturalmente em CRUD poderão utilizar endpoints explícitos de ação.

A API pública será versionada por major version na URL, utilizando o prefixo:

```text
/api/v1
```

Mudanças incompatíveis de contrato exigirão nova major version. O versionamento da API é independente do `cryptoVersion`.

### 4.2 Representação dos payloads

JSON será a representação padrão da API V1.

- propriedades em `camelCase`;
- identificadores serializados como strings;
- timestamps operacionais em ISO 8601 UTC;
- ausência de campo e `null` poderão possuir semânticas distintas;
- campos criptográficos serão transportados em representação textual apropriada;
- conteúdo criptografado permanecerá opaco ao servidor.

### 4.3 Contrato de erros

Erros utilizarão status HTTP semanticamente apropriados e corpo JSON padronizado com:

- `error.code`: código estável para consumo programático;
- `error.message`: mensagem destinada a diagnóstico/apresentação;
- `error.details`: informações adicionais estruturadas quando necessárias e seguras.

Clientes não poderão depender do texto de `error.message` para lógica de aplicação.

Falhas internas não deverão expor stack traces, SQL, caminhos internos, segredos ou outros detalhes sensíveis.

### 4.4 Concorrência otimista

Recursos mutáveis sujeitos a concorrência utilizarão `revision`.

A revisão corrente será exposta também por `ETag`, e operações condicionais utilizarão `If-Match`.

Uma atualização baseada em revisão obsoleta será rejeitada explicitamente, sem merge automático e sem sobrescrita silenciosa.

Esse mecanismo trata concorrência operacional. Ele não constitui garantia criptográfica de freshness nem proteção contra rollback/replay, assuntos relacionados ao ADR-003.8.

### 4.5 Atualização de VaultItem

Na V1, a atualização do conteúdo de um `VaultItem` utilizará `PUT`, representando a substituição integral de sua representação criptografada mutável.

Alterações parciais no conteúdo descriptografado são responsabilidade do cliente:

```text
descriptografar → modificar → reencriptar → enviar novo envelope
```

A API não oferecerá `PATCH` sobre campos internos do payload criptografado. `PATCH` não fica proibido para outros recursos quando houver semântica apropriada.

### 4.6 Criação de VaultItem

A criação utilizará `POST` sobre a coleção de itens.

O `itemId` será gerado previamente pelo cliente, conforme ADR-005, e enviado no payload. O servidor validará formato, unicidade e autorização, mas não substituirá silenciosamente recurso existente com o mesmo identificador.

### 4.7 Endereçamento explícito do Vault

`VaultItem` será endereçado sob seu `Vault` explícito:

```text
/api/v1/vaults/{vaultId}/items
/api/v1/vaults/{vaultId}/items/{itemId}
```

O servidor deverá validar acesso ao Vault e pertencimento do item ao Vault.

A presença de `vaultId` na rota não altera a política da V1 de no máximo um Vault por User e não implica suporte a múltiplos Vaults.

### 4.8 Listagem na V1

A V1 utilizará carregamento integral dos `VaultItems` do Vault, sem paginação obrigatória, em coerência com o modelo cloud-first/full-vault-download definido no ADR-003.7.

Limites operacionais poderão ser impostos para proteção do serviço. Paginação e sincronização incremental permanecem possibilidades evolutivas.

### 4.9 Exclusão lógica, restauração e purga

`DELETE` sobre um `VaultItem` representará exclusão lógica:

```text
ACTIVE → TRASHED
```

Restauração e purga serão operações explícitas de domínio:

```text
TRASHED → ACTIVE
TRASHED → PURGED
```

Operações que alterem o estado do item estarão sujeitas a `revision`/`If-Match`.

A política temporal de retenção da lixeira não é definida por este ADR.

### 4.10 Idempotência de criação

Na V1, a prevenção de duplicação na criação de `VaultItem` utilizará primordialmente o `itemId` globalmente único gerado pelo cliente.

Retries da mesma criação deverão reutilizar o mesmo identificador. O servidor não criará um segundo recurso nem sobrescreverá silenciosamente um recurso existente com o mesmo `itemId`.

Um mecanismo genérico de `Idempotency-Key` não será requisito da V1.

### 4.11 Autenticação da API

Requisições autenticadas utilizarão:

```http
Authorization: Bearer <access-token>
```

A representação interna do access token, como token opaco ou estruturado, não é fixada neste ADR.

Tokens de autenticação não transportarão Master Password, Vault Key ou material capaz de descriptografar o Vault.

Autenticação da sessão permanece separada do desbloqueio do cofre.

### 4.12 Expiração e renovação

Access tokens terão validade limitada.

A arquitetura permitirá renovação segura da sessão autenticada sem exigir nova autenticação completa a cada expiração, desde que sessão e dispositivo permaneçam válidos e não revogados.

Mecanismo concreto e tempos de expiração serão definidos em implementação/política de segurança.

Renovar uma sessão autenticada não desbloqueia o Vault nem concede acesso à Vault Key.

### 4.13 Reautenticação de operações críticas

Operações críticas utilizarão fluxo explícito de reautenticação separado da operação de domínio.

Uma reautenticação bem-sucedida concederá autorização temporária:

- vinculada à sessão;
- com escopo restrito;
- com validade limitada.

O contrato não ficará acoplado a um único método de reautenticação, permitindo evolução futura para mecanismos como WebAuthn/passkeys.

Reautenticação da conta permanece distinta do desbloqueio do Vault.

### 4.14 Autorização server-side

Todo acesso a recursos protegidos será autorizado no servidor com base na identidade autenticada e nas relações de propriedade/acesso do domínio.

Identificadores fornecidos pelo cliente jamais constituirão prova de autorização.

Para `VaultItem`, o servidor validará:

1. acesso do usuário ao `Vault`;
2. pertencimento do `VaultItem` ao `Vault`;
3. autorização para a operação solicitada.

As respostas não deverão revelar desnecessariamente a existência de recursos aos quais o usuário não possui acesso.

### 4.15 Respostas de sucesso

A API utilizará status HTTP semanticamente apropriados também para sucesso.

Exemplos:

- leitura: `200 OK`;
- criação: `201 Created`;
- atualização com representação: `200 OK`;
- operação concluída sem corpo: `204 No Content`.

Quando aplicável, criações fornecerão `Location` e recursos controlados por `revision` fornecerão `ETag`.

Não será utilizado envelope genérico como `success: true` quando o próprio HTTP já representar o resultado.

### 4.16 Validação e limites

O servidor validará rigorosamente toda informação operacional visível no contrato, incluindo:

- presença e formato;
- tamanho;
- versão suportada;
- consistência estrutural;
- identificadores e relações autorizadas.

Conteúdo protegido pelo modelo Zero-Knowledge não será interpretado ou validado semanticamente pelo servidor.

A API aplicará limites operacionais de tamanho e quantidade para proteção contra abuso e consumo excessivo de recursos. Valores concretos poderão permanecer configuráveis/documentados fora deste ADR quando não constituírem decisão arquitetural.

Entradas desconhecidas ou inválidas serão rejeitadas explicitamente conforme o contrato de erros.

## 5. Justificativa

As decisões priorizam um contrato simples, explícito e independente da implementação.

REST/HTTP e versionamento por URL favorecem interoperabilidade entre clientes. `revision` com `ETag`/`If-Match` utiliza semântica nativa do HTTP para impedir sobrescritas silenciosas. O Vault explícito preserva a independência da entidade mesmo com a limitação de um Vault por User na V1.

O contrato mantém a fronteira Zero-Knowledge: o servidor valida estrutura operacional e autorização, mas não interpreta conteúdo sensível criptografado.

As decisões evitam complexidade antecipada, como GraphQL, paginação obrigatória, sincronização incremental e infraestrutura genérica de `Idempotency-Key`, sem impedir sua adoção futura quando houver necessidade concreta.

## 6. Princípios

- Contrato antes da implementação.
- HTTP deve carregar semântica, não apenas transporte.
- IDs identificam recursos; não autorizam acesso.
- O servidor valida o que consegue conhecer, sem romper Zero-Knowledge.
- Concorrência operacional não deve ser confundida com integridade/freshness criptográfica.
- Limitações da V1 não devem ser incorporadas desnecessariamente à identidade permanente dos recursos.
- Simplicidade agora, evolução explícita depois.

## 7. Consequências

### Positivas

- contrato comum para Web, extensão Chrome e Android;
- comportamento previsível para erros e respostas;
- prevenção de lost updates por concorrência;
- fronteira clara entre cliente criptográfico e servidor;
- autorização server-side explícita;
- evolução da API independente da evolução criptográfica;
- menor complexidade operacional na V1.

### Trade-offs

- full-vault download pode se tornar inadequado para cofres muito grandes;
- clientes precisam manter e enviar revisões corretamente;
- `PUT` exige reencriptação completa do payload mesmo para pequenas alterações;
- reautenticação adiciona estado/política temporária à sessão;
- ausência de `Idempotency-Key` genérico exige disciplina do cliente na reutilização do `itemId` durante retries.

## 8. Fora do Escopo

Este ADR não define:

- framework backend;
- ORM;
- banco de dados;
- esquema físico, índices ou constraints de persistência;
- formato interno definitivo do access token;
- algoritmo/tecnologia concreta de renovação de sessão;
- tempos exatos de expiração;
- método definitivo de reautenticação;
- valores concretos dos limites operacionais;
- paginação ou sincronização incremental da V2;
- proteção criptográfica contra rollback/replay;
- política temporal de retenção da lixeira.

## 9. ADRs Relacionadas

- ADR-000 — Princípios Fundamentais
- ADR-001 — Arquitetura Geral
- ADR-002 — Modelo de Autenticação
- ADR-003 — Modelo Criptográfico
- ADR-003.5 — Additional Authenticated Data (AAD)
- ADR-003.7 — Modelo de Armazenamento do Cofre
- ADR-003.8 — Integridade Global do Cofre
- ADR-004 — Gestão de Sessões
- ADR-004.5 — Reautenticação para Operações Críticas
- ADR-005 — Modelo de Dados
- ADR-007 — Persistência e Banco de Dados

## 10. Decisões Formalmente Aprovadas

- **D01:** HTTP com contratos predominantemente RESTful; ações de domínio explícitas quando CRUD não for natural.
- **D02:** versionamento por major version na URL com `/api/v1`; independente de `cryptoVersion`.
- **D03:** JSON, `camelCase`, IDs como strings e timestamps ISO 8601 UTC.
- **D04:** erros estruturados com status HTTP, `error.code`, `error.message` e `error.details` opcional.
- **D05:** concorrência otimista por `revision`, exposta via `ETag` e condicionada por `If-Match`.
- **D06:** atualização do conteúdo criptografado de `VaultItem` por `PUT`, sem `PATCH` interno ao payload.
- **D07:** criação por `POST`, com `itemId` gerado previamente pelo cliente.
- **D08:** `Vault` explícito nas rotas de `VaultItem` por `vaultId`.
- **D09:** carregamento integral dos itens na V1, sem paginação obrigatória.
- **D10:** `DELETE` representa exclusão lógica; restauração e purga são ações explícitas.
- **D11:** idempotência de criação baseada primordialmente na reutilização do `itemId`; sem `Idempotency-Key` genérico obrigatório na V1.
- **D12:** autenticação da API por `Authorization: Bearer <access-token>`, sem fixar a representação interna do token.
- **D13:** access token com validade limitada e mecanismo seguro de renovação da sessão.
- **D14:** reautenticação separada para operações críticas, com autorização temporária, limitada por sessão, escopo e validade.
- **D15:** autorização obrigatória server-side; IDs nunca constituem prova de autorização.
- **D16:** uso semântico dos status HTTP de sucesso, com `Location` e `ETag` quando aplicáveis.
- **D17:** validação rigorosa da estrutura operacional visível, sem inspeção semântica do conteúdo Zero-Knowledge, com limites operacionais de proteção.

## 11. Histórico de Versões

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 23/09/2026 | Consolidação e aprovação inicial das decisões D01–D17. |
