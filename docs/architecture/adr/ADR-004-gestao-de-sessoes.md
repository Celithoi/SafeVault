# ADR-004 --- Gestão de Sessões

**Status:** 🟢 Approved\
**Versão:** 1.0 consolidada\
**Data:** 31/07/2026\
**Autor:** Marcelo Henrique Rocha Cardoso

## 1. Contexto

O SafeVault precisa distinguir identidade autenticada da disponibilidade
temporária do material criptográfico do cofre.

## 2. Decisão

``` text
Sessão autenticada ≠ Cofre desbloqueado
```

A sessão autenticada confirma identidade e autorização de conta. O cofre
desbloqueado representa a disponibilidade temporária da Vault Key no
cliente.

## 3. Regras Centrais

-   bloquear cofre não realiza logout;
-   logout sempre implica bloqueio;
-   Vault Key é descartada no bloqueio;
-   conteúdo descriptografado é descartado no bloqueio;
-   múltiplos dispositivos lógicos podem possuir sessões independentes;
-   cada dispositivo realiza seu próprio desbloqueio;
-   revogação pode ser individual;
-   uma única aba por perfil de navegador mantém o cofre ativamente
    desbloqueado;
-   Vault Keys não são compartilhadas entre abas ou dispositivos;
-   operações críticas exigem reautenticação recente.

## 4. ADRs Derivadas

-   ADR-004.1 --- Sessão Autenticada
-   ADR-004.2 --- Sessão do Cofre
-   ADR-004.3 --- Bloqueio Automático e Inatividade
-   ADR-004.4 --- Sessões por Dispositivo
-   ADR-004.5 --- Reautenticação para Operações Críticas

## 5. Decisões Formalmente Aprovadas

-   ✅ Sessão autenticada e cofre desbloqueado são estados
    independentes.
-   ✅ Credencial de acesso será curta e haverá mecanismo
    renovável/revogável.
-   ✅ JWT versus token opaco permanece decisão de implementação
    posterior.
-   ✅ Bloqueio não é logout.
-   ✅ Logout implica bloqueio.
-   ✅ Múltiplos dispositivos são permitidos.
-   ✅ Exclusividade de desbloqueio entre abas é local ao perfil do
    navegador.
-   ✅ Reautenticação protege operações críticas.
