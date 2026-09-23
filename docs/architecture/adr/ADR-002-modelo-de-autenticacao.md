# ADR-002 --- Modelo de Autenticação

**Status:** 🟢 Approved\
**Versão:** 1.0\
**Data:** 27/07/2026\
**Autor:** Marcelo Henrique Rocha Cardoso

## 1. Contexto

O SafeVault necessita autenticar usuários sem confundir identidade da
conta com acesso ao conteúdo criptografado do cofre.

## 2. Decisão

A V1 adotará:

-   login por e-mail;
-   uma única Master Password informada pelo usuário;
-   autenticação separada do desbloqueio do cofre;
-   MFA opcional, com arquitetura preparada para evolução;
-   criação de usuários pelo administrador;
-   primeiro administrador criado no setup inicial;
-   identificação de dispositivos/sessões;
-   reautenticação para operações sensíveis.

## 3. Recuperação

**Recuperação da conta não equivale a recuperação do cofre.**

O sistema poderá evoluir em mecanismos administrativos ou de recuperação
de identidade, mas estes não poderão criar um bypass do modelo
Zero-Knowledge.

Na modalidade de controle exclusivo da V1:

-   o servidor não conhece a Master Password;
-   administrador não possui acesso privilegiado ao plaintext;
-   perda da Master Password pode tornar o conteúdo do cofre
    irrecuperável.

## 4. Princípios

1.  Autenticação confirma identidade.
2.  Autenticação não significa cofre desbloqueado.
3.  Desbloqueio é processo independente.
4.  Operações críticas exigem confirmação recente.
5.  MFA e métodos futuros não devem exigir reestruturação do modelo
    central.

## 5. Decisões Formalmente Aprovadas

-   ✅ Login exclusivamente por e-mail.
-   ✅ Uma Master Password para o usuário.
-   ✅ Autenticação e derivação criptográfica são responsabilidades
    distintas.
-   ✅ MFA opcional na V1.
-   ✅ Administradores criam/convidam usuários.
-   ✅ Dispositivos/sessões são identificáveis e revogáveis.
-   ✅ Operações críticas exigem reautenticação.
-   ✅ Recuperação de conta não poderá equivaler a recuperação do
    conteúdo do cofre.
