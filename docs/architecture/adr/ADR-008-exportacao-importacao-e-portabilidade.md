# ADR-008 — Exportação, Importação e Portabilidade

**Status:** 🟢 Approved  
**Versão:** 1.0  
**Data:** 27/09/2026  
**Autor:** Marcelo Henrique Rocha Cardoso  
**Revisado por:** ChatGPT  
**Impacto:** Alto  
**Escopo:** Backup nativo, restore controlado, recovery point pré-restore e portabilidade interoperável da V1

## 1. Contexto

O SafeVault adota Zero-Knowledge, criptografia client-side e separação entre identidade autenticada e capacidade criptográfica sobre o Vault. As ADRs 003–007 e suas derivadas definem as fronteiras criptográficas, sessões, modelo de dados, contratos da API e persistência.

Backup seguro e portabilidade externa atendem a necessidades diferentes. O formato nativo `.svb` preserva artefatos criptográficos para backup, transferência e restore. JSON/CSV representam conteúdo interoperável e podem expor plaintext por decisão explícita do usuário, sob os controles desta ADR e a exceção delimitada na ADR-003.7.

## 2. Problema

É necessário definir formatos e garantias para exportar, importar e restaurar dados sem romper Zero-Knowledge, confundir posse de backup com autenticação de conta ou permitir alterações destrutivas silenciosas.

Restore precisa proteger tanto contra falha técnica quanto contra a escolha de um backup incorreto. Importação interoperável precisa validar dados e criar itens apropriados ao destino sem merge, overwrite ou deduplicação silenciosa.

## 3. Alternativas Consideradas

As decisões aprovadas distinguem:

- backup nativo criptografado e exportação interoperável plaintext;
- preservação de artefatos criptográficos existentes e decrypt/re-encrypt completo apenas para exportar;
- restore controlado e merge genérico;
- rollback transacional e recovery point pré-restore;
- um recovery point operacional temporário e version history;
- JSON de maior fidelidade e CSV tabular simplificado;
- pipeline interoperável comum e adapters específicos de terceiros.

## 4. Decisão

### D01 — Secure export × interoperable export

O SafeVault distingue formalmente exportação segura de exportação interoperável. O formato nativo criptografado .svb serve para backup/transferência/restore dentro do SafeVault, preservando confidencialidade. JSON/CSV servem para portabilidade externa e podem materializar plaintext, sendo operações críticas com comunicação explícita de risco. Os formatos não são conceitualmente equivalentes.
Princípio: Backup seguro e interoperabilidade são problemas diferentes.

### D02 — Conteúdo do .svb

Na V1, .svb preserva os artefatos criptográficos existentes e os metadados necessários para interpretação/restauração, evitando decrypt/re-encrypt completo apenas para exportar. É versionado e self-contained quanto à estrutura e interpretação criptográfica. Não contém Master Password, Vault Key em plaintext nem conteúdo sensível descriptografado. Pode conter formatVersion, cryptoVersion, metadados KDF necessários, wrappedVaultKey, metadados necessários do Vault, VaultItems com seus artefatos criptográficos e integridade estrutural. Uma futura senha/chave independente de exportação exigirá desenho criptográfico próprio.

### D03 — Backup pertence ao usuário, não à conta

.svb não fica permanentemente vinculado à existência da conta originária. Quem possui o arquivo e o segredo criptográfico necessário pode recuperar/portar os dados. Entretanto, possuir ou descriptografar .svb não concede autorização sobre nenhuma conta SafeVault. Persistência server-side exige sessão autenticada, autorização no destino e controles de operação crítica. IDs autenticados por AAD não podem ser silenciosamente remapeados.

### D04 — Restore controlado

V1 usa restore controlado, não merge genérico. Não existe overwrite silencioso do Vault atual. Formato, compatibilidade e integridade estrutural são validados antes de mutação. Restore destrutivo exige autorização, reautenticação e confirmação explícita. Não haverá merge automático, resolução automática de conflitos ou escolha automática do “estado mais novo”. Importação seletiva poderá existir futuramente, mas não faz parte desta decisão V1. Até o usuário cruzar conscientemente a fronteira destrutiva, nenhuma mutação ocorre no Vault atual. O backend também deve impor essa propriedade.

### D05 — Garantia de recuperação pré-restore

Antes de um restore capaz de substituir Vault existente, o SafeVault deve preservar um caminho tecnicamente verificável para recuperar o estado anterior.

#### D05.1 — Duas camadas independentes de proteção

Transação/rollback protege contra falha técnica durante o restore. Recovery point pré-restore protege contra restore concluído corretamente mas posteriormente identificado como errado. O recovery point preserva artefatos criptográficos existentes sem descriptografia server-side e sua existência deve ser confirmada antes da mutação destrutiva.

#### D05.2 — Retenção curta + descarte antecipado

Recovery points têm retenção curta e predeterminada e podem ser descartados antecipadamente pelo usuário após validação do restore.

#### D05.3 — Um recovery point operacional

V1 mantém no máximo um recovery point operacional por Vault, associado ao restore destrutivo mais recente. Recovery Point não constitui version history.

#### D05.4 — Substituição segura do recovery point

Um novo restore não pode invalidar/remover o recovery point existente antes que o estado atual tenha sido preservado validamente. Toda validação possível do arquivo deve ocorrer antes da fronteira de mutação. A substituição do recovery point e aplicação do novo estado devem preservar atomicidade e consistência, de modo que uma falha não deixe o Vault sem estado recuperável válido.

### D06 — PURGE × recovery point

PURGE remove fisicamente o item do estado operacional do Vault, mas não reescreve recovery points pré-existentes ainda válidos. Enquanto existir recovery point capaz de conter estado anterior, UI/documentação não podem representar o conteúdo como imediatamente erradicado de todas as cópias recuperáveis. Expiração ou descarte do recovery point encerra essa capacidade dentro do mecanismo de restore do SafeVault.

### D07 — Retenção de 7 dias

Na V1, recovery point pré-restore possui retenção máxima de 7 dias contados da criação. Pode ser descartado antecipadamente pelo usuário. Uso normal do Vault não renova a retenção. Não constitui histórico nem backup permanente. Novo restore pode substituí-lo conforme D05.4.

### D08 — JSON/CSV plaintext

Exportações interoperáveis que contenham conteúdo descriptografado são geradas exclusivamente client-side e classificadas como operações críticas de exposição de plaintext. Exigem reautenticação apropriada e consentimento explícito após comunicação inequívoca do risco. O servidor não recebe conteúdo sensível descriptografado para gerar esses arquivos. Após entrega ao ambiente do usuário, sua proteção deixa de estar sob controle do SafeVault.

### D09 — Modelo interoperável, não dump interno

JSON/CSV representam dados semanticamente úteis ao usuário e não dumps do banco, API ou estruturas criptográficas internas. Metadados exclusivamente operacionais/criptográficos são omitidos salvo quando necessários à representação correta. Formatos externos possuem estrutura documentada e versionada independentemente do schema interno.

### D10 — JSON × CSV

JSON é o formato interoperável de maior fidelidade da V1 e pode representar estruturas compostas. CSV é representação tabular simplificada e não precisa preservar estruturas que não possam ser representadas claramente. Não embutir serializações opacas/estruturas internas em células apenas para simular equivalência. Qualquer redução/perda de informação em CSV deve ser detectada e comunicada antes da geração.

### D11 — JSON oficialmente importável

O JSON interoperável SafeVault é oficialmente exportável e importável, identificado e versionado por schema próprio. Importação significa criação controlada de dados no Vault destino, não restauração de estado interno. Conteúdo é validado/normalizado antes da criação de novos VaultItems, que recebem IDs, metadados operacionais e artefatos criptográficos apropriados ao destino. Estruturas desconhecidas, versões incompatíveis ou dados inválidos não são silenciosamente interpretados/persistidos.

### D12 — Duplicidade

Importação interoperável não realiza merge, overwrite ou deduplicação silenciosa. Dados importados são candidatos à criação de novos itens. Eventual detecção confiável de possíveis duplicatas ocorre client-side e é apenas informativa; decisão permanece explícita do usuário. Ausência de detecção não garante unicidade. Detector sofisticado de duplicatas não é requisito obrigatório da V1.

### D13 — Validação pré-mutation

.svb e JSON importados têm formato, versão, estrutura e limites validados antes de qualquer alteração do Vault. Entrada inválida/incompatível falha de maneira segura.

### D14 — Compatibilidade explícita

Formatos são versionados. SafeVault importa/restaura apenas versões que sabe interpretar com segurança; não tenta adivinhar silenciosamente formatos desconhecidos ou futuros.

### D15 — Importação sensível client-side

JSON plaintext é processado/validado no cliente e convertido em novos VaultItems criptografados antes da persistência. O servidor não recebe o conteúdo sensível plaintext.

### D16 — Sem estado parcial silencioso

Restore segue as garantias fortes já definidas. Importação em lote também deve possuir comportamento transacional/controlado: o conjunto aprovado é persistido corretamente ou a operação falha sem deixar resultado parcial silencioso.

### D17 — Limites defensivos

Import/export terá limites de tamanho, quantidade de itens e complexidade para proteção contra abuso/exaustão de recursos/arquivos maliciosos. Valores numéricos são detalhe de implementação e não são definidos nesta ADR.

### D18 — .svb não autentica conta

Posse do backup e capacidade de descriptografá-lo demonstram capacidade criptográfica sobre o conteúdo, não identidade/autorização sobre uma conta SafeVault.

### D19 — Adapters externos fora da V1, arquitetura extensível

Importadores específicos para LastPass, Bitwarden, 1Password, KeePass e outros ficam fora da V1. Entretanto, o pipeline de importação deve permitir futuramente adapters que convertam formatos externos para o modelo interoperável validado do SafeVault sem modificar o núcleo do processo de importação. LastPass é um caso futuro relevante, mas não deve aumentar o escopo V1.

## 5. Justificativa

A separação de formatos preserva a finalidade de cada operação. O `.svb` mantém os artefatos criptográficos existentes; o modelo interoperável representa dados úteis ao usuário sem depender do schema interno. A capacidade de descriptografar um backup não substitui autorização no destino.

Transação e recovery point cobrem falhas distintas. A retenção máxima de sete dias e a limitação a um recovery point operacional fornecem recuperação pré-restore sem introduzir histórico permanente. Validação prévia, confirmação explícita e limites defensivos tornam as operações controladas.

## 6. Princípios

- Backup seguro e interoperabilidade são problemas diferentes.
- Capacidade criptográfica sobre conteúdo não autentica uma conta.
- O servidor não recebe conteúdo sensível plaintext.
- Nenhuma substituição destrutiva ocorre silenciosamente.
- Recovery point não constitui version history nem backup permanente.
- Compatibilidade é explícita; formatos desconhecidos não são adivinhados.
- Portabilidade futura utiliza o pipeline interoperável validado sem ampliar a V1.

## 7. Consequências

### Positivas

- backup nativo sem descriptografia completa apenas para exportação;
- portabilidade interoperável com JSON oficialmente importável;
- proteção verificável do estado anterior ao restore;
- preservação das fronteiras de autenticação, autorização e criptografia;
- evolução futura por adapters sem modificar o núcleo da importação.

### Custos e trade-offs

- arquivos plaintext exportados exigem proteção pelo usuário após a entrega;
- CSV pode perder informação, com comunicação obrigatória antes da geração;
- recovery point exige retenção, expiração, descarte e substituição consistentes;
- PURGE operacional não elimina imediatamente conteúdo de recovery points ainda válidos;
- importação pode criar duplicatas quando o usuário aprova novos itens; detecção sofisticada não é obrigatória;
- limites defensivos e contratos de formatos precisam ser concretizados na implementação.

## 8. Fora do Escopo deste ADR

- merge automático, overwrite silencioso e deduplicação silenciosa;
- importação seletiva de backup como funcionalidade da V1;
- version history e backup permanente por recovery points;
- senha/chave independente de exportação sem desenho criptográfico próprio;
- importadores específicos para LastPass, Bitwarden, 1Password, KeePass e outros na V1;
- valores numéricos dos limites defensivos;
- schemas concretos dos formatos, endpoints e mecanismos físicos de implementação;
- solução criptográfica de freshness/anti-rollback, pendente na ADR-003.8;
- infraestrutura de backup do banco e seus procedimentos operacionais.

## 9. ADRs Relacionadas e Checkpoint de Consistência

| Referência | Verificação |
|---|---|
| ADR-003 e ADR-003.1–003.4 | `.svb` preserva artefatos existentes e metadados de interpretação; Master Password, Vault Key plaintext e conteúdo sensível descriptografado não integram o backup. Processamento sensível permanece no cliente. |
| ADR-003.5 | IDs vinculados ao AAD não são silenciosamente remapeados no restore. Importação interoperável cria novos itens com contexto e artefatos apropriados ao destino. |
| ADR-003.6 | Compatibilidade e versões são explícitas; esta ADR não autoriza downgrade criptográfico ou interpretação de versões desconhecidas. |
| ADR-003.7 | Harmonização autorizada delimita a proibição de persistência de plaintext à operação normal do SafeVault e reconhece exclusivamente a exportação interoperável controlada. Cloud First, source of truth no servidor e ausência de cache persistente/offline permanecem. |
| ADR-003.8 | Integridade estrutural, AEAD, transações e recovery point não são apresentados como solução criptográfica de freshness/anti-rollback. A dependência continua deferred. |
| ADR-004 e ADR-004.1–004.5 | Sessão autenticada, unlock e reautenticação permanecem distintos. Exportação continua operação crítica; restore destrutivo exige autorização, reautenticação e confirmação. O descarte de material operacional sensível no bloqueio permanece válido. |
| ADR-005 | Ownership e máximo de um Vault por User permanecem. Recovery point é proteção operacional pré-restore, não segundo Vault nem histórico de versões. Importação cria itens apropriados ao destino. |
| ADR-006 | Autorização server-side, concorrência explícita, validação operacional e limites permanecem aplicáveis. Ações de domínio podem representar restore/importação sem merge ou sobrescrita silenciosa. Conteúdo sensível permanece opaco ao servidor. |
| ADR-007 | Atomicidade e consistência de D05.4 e D16 respeitam as unidades transacionais de domínio. PURGE remove o item da persistência operacional; recovery point anterior ainda válido segue D06–D07. Retenção desse mecanismo não redefine retenção de backup de infraestrutura. |

**Resultado:** checkpoint aprovado após a harmonização mínima autorizada da ADR-003.7. Nenhum outro conflito identificado nas decisões D01–D19. As demais ADRs permanecem inalteradas.

## 10. Decisões Formalmente Aprovadas

- **D01 🟢** — Exportação segura e interoperável possuem finalidades distintas.
- **D02 🟢** — `.svb` preserva artefatos criptográficos existentes e metadados necessários, sem segredos plaintext.
- **D03 🟢** — Backup pertence ao usuário; persistência no destino depende de autorização e respeita AAD.
- **D04 🟢** — Restore controlado, validado e explicitamente confirmado, sem merge genérico.
- **D05 🟢** — Recuperação pré-restore verificável, conforme D05.1–D05.4: rollback técnico e recovery point independentes, descarte antecipado, máximo de um ponto operacional e substituição segura e atômica.
- **D06 🟢** — PURGE operacional não reescreve recovery points anteriores ainda válidos.
- **D07 🟢** — Retenção máxima de sete dias desde a criação, sem renovação pelo uso normal.
- **D08 🟢** — Exportação plaintext exclusivamente client-side, com reautenticação, comunicação do risco e consentimento explícito.
- **D09 🟢** — Modelo interoperável documentado e versionado, independente de dumps internos.
- **D10 🟢** — JSON de maior fidelidade; CSV simplificado com perdas comunicadas previamente.
- **D11 🟢** — JSON SafeVault oficialmente exportável e importável para criação controlada de novos itens.
- **D12 🟢** — Sem merge, overwrite ou deduplicação silenciosa; detecção de duplicatas apenas informativa e client-side.
- **D13 🟢** — Validação de formato, versão, estrutura e limites antes de alterar o Vault.
- **D14 🟢** — Compatibilidade explícita, sem interpretação silenciosa de formatos desconhecidos ou futuros.
- **D15 🟢** — JSON sensível processado no cliente e criptografado antes da persistência.
- **D16 🟢** — Restore e importação em lote sem resultado parcial silencioso.
- **D17 🟢** — Limites defensivos de tamanho, quantidade e complexidade, com valores definidos na implementação.
- **D18 🟢** — Posse ou descriptografia de `.svb` não autentica nem autoriza acesso a conta.
- **D19 🟢** — Adapters externos fora da V1; arquitetura extensível sobre o pipeline interoperável validado.

## 11. Histórico de Versões

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 27/09/2026 | Consolidação de D01–D19, incluindo D05.1–D05.4, e checkpoint após harmonização autorizada da ADR-003.7. |
