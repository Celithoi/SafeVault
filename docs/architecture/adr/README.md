# SafeVault --- Architecture Decision Records

**Baseline documental:** 30/08/2026\
**Escopo desta consolidação:** ADR-000 até ADR-005, incluindo ADRs
derivadas já aprovadas de criptografia e gestão de sessões.

## Regra de governança

> **Discussões são transitórias. Decisões aprovadas são patrimônio
> técnico.**

As conversas, hipóteses, alternativas descartadas informalmente,
brincadeiras e raciocínios intermediários não constituem documentação
oficial.

Uma decisão arquitetural aprovada representa a melhor decisão sustentada
pelas evidências e requisitos disponíveis naquele momento. Ela pode ser
revisada quando surgirem evidências concretas provenientes de
implementação, testes, novos requisitos, análise de segurança ou
incompatibilidades arquiteturais.

## Status

-   ⚪ Draft
-   🟡 Under Discussion
-   🟢 Approved
-   🔵 Revised
-   🔴 Obsolete
-   ⚫ Superseded

## ADRs desta baseline

  -----------------------------------------------------------------------
  ADR                     Título                  Status
  ----------------------- ----------------------- -----------------------
  ADR-000                 Princípios Fundamentais 🟢 Approved

  ADR-001                 Arquitetura Geral       🟢 Approved

  ADR-002                 Modelo de Autenticação  🟢 Approved

  ADR-003                 Modelo Criptográfico    🟢 Approved

  ADR-003.1               Derivação de Chaves     🟢 Approved

  ADR-003.2               Vault Key               🟢 Approved

  ADR-003.3               Criptografia Simétrica  🟢 Approved

  ADR-003.4               Envelope Criptográfico  🟢 Approved

  ADR-003.5               Additional              🔵 Revised
                          Authenticated Data      
                          (AAD)                   

  ADR-003.6               Versionamento           🟢 Approved
                          Criptográfico           

  ADR-003.7               Modelo de Armazenamento 🟢 Approved
                          do Cofre                

  ADR-003.8               Integridade Global do   🟡 Deferred / decisão
                          Cofre                   pendente

  ADR-004                 Gestão de Sessões       🟢 Approved

  ADR-004.1               Sessão Autenticada      🟢 Approved

  ADR-004.2               Sessão do Cofre         🟢 Approved

  ADR-004.3               Bloqueio Automático e   🟢 Approved
                          Inatividade             

  ADR-004.4               Sessões por Dispositivo 🟢 Approved

  ADR-004.5               Reautenticação para     🟢 Approved
                          Operações Críticas      

  ADR-005                 Modelo de Dados         🟢 Approved
  -----------------------------------------------------------------------

## Próximo marco

ADR-006 --- Contratos da API.

Após ADR-006 e ADR-007 será realizado um checkpoint arquitetural leve
antes de prosseguir.
