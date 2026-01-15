# Backlog de Produto e Histórias de Usuário

Este documento descreve os requisitos funcionais e não-funcionais da plataforma.

## Épico 1: Captura e Ideação

Focado na entrada de dados e estruturação inicial das propostas.

*   **US01 - Submissão de Ideia Detalhada**
    *   **História:** Como **Colaborador**, eu quero submeter uma ideia com título, descrição rica, anexos (imagens/PDF) e categorização (Horizonte 1, 2 ou 3), para que minha proposta seja compreendida claramente.
    *   **Critérios de Aceite:**
        *   O formulário deve permitir upload de arquivos até 5MB.
        *   O campo de descrição deve suportar Markdown.
        *   O usuário deve obrigatoriamente selecionar um "Horizonte de Inovação" (H1: Melhoria Contínua, H2: Adjacente, H3: Disruptiva).
        *   Ao salvar, o status inicial deve ser "Rascunho" ou "Submetida" (se confirmado).

*   **US02 - Edição de Rascunho**
    *   **História:** Como **Colaborador**, quero salvar minha ideia como rascunho e continuá-la mais tarde, para não perder trabalho se não tiver todas as informações no momento.
    *   **Critérios de Aceite:**
        *   Botão "Salvar Rascunho" deve persistir os dados sem validar campos obrigatórios complexos.
        *   Ideias em rascunho não são visíveis para outros usuários.

## Épico 2: Colaboração Social

Focado no enriquecimento das ideias através da inteligência coletiva.

*   **US03 - Sistema de Comentários e Menções**
    *   **História:** Como **Colaborador**, quero comentar em ideias de colegas e mencionar outros usuários usando `@nome`, para sugerir melhorias ou solicitar feedback específico.
    *   **Critérios de Aceite:**
        *   Digitar `@` deve abrir uma lista de sugestão de usuários.
        *   O usuário mencionado deve receber uma notificação no sistema.
        *   Comentários podem ser editados pelo autor por até 15 minutos após postagem.

*   **US04 - Votação Ponderada**
    *   **História:** Como **Gestor de Inovação**, quero que os votos tenham pesos diferentes baseados na role do usuário (ex: Especialistas tem peso 2, Diretores peso 3), para que a avaliação reflita a expertise técnica e estratégica.
    *   **Critérios de Aceite:**
        *   O sistema deve calcular o score total da ideia somando `(voto * peso_da_role)`.
        *   O usuário vê apenas o score total, mas o admin pode ver o detalhe dos votos.
        *   Um usuário não pode votar duas vezes na mesma ideia (apenas alterar seu voto).

## Épico 3: Gamificação

Focado no engajamento e retenção dos usuários.

*   **US05 - Ganho de XP e Níveis**
    *   **História:** Como **Colaborador**, quero ganhar pontos de experiência (XP) por ações realizadas (submeter, votar, comentar), para subir de nível e mostrar minha contribuição.
    *   **Critérios de Aceite:**
        *   Submeter ideia: +50 XP. Votar: +2 XP. Comentário aprovado/útil: +5 XP.
        *   Usuário deve ver uma barra de progresso para o próximo nível no seu perfil.

*   **US06 - Badges Automáticas**
    *   **História:** Como **Sistema**, quero atribuir badges automaticamente quando critérios forem atingidos (ex: "Ideador do Mês" para quem teve a ideia mais votada), para reconhecer o talento.
    *   **Critérios de Aceite:**
        *   Job noturno calcula métricas e atribui badges.
        *   Badge "Primeira Ideia" atribuída imediatamente após a primeira submissão aprovada.

## Épico 4: Pipeline de Governança

Focado no fluxo de controle e aprovação.

*   **US07 - Workflow de Estados e Gate Criteria**
    *   **História:** Como **Gestor de Inovação**, quero mover ideias entre estados (Triagem -> Análise -> Aprovado) apenas se critérios de passagem forem atendidos, para garantir a qualidade do funil.
    *   **Critérios de Aceite:**
        *   Transição "Triagem -> Análise" requer que a ideia tenha no mínimo 5 votos positivos.
        *   Transição "Análise -> Aprovado" requer preenchimento obrigatório do parecer técnico pelo Avaliador.
        *   Log de auditoria deve registrar quem mudou o status e quando.

*   **US08 - Reprovação com Justificativa**
    *   **História:** Como **Gestor**, quero rejeitar uma ideia fornecendo um motivo padronizado ou personalizado, para dar feedback educativo ao autor.
    *   **Critérios de Aceite:**
        *   Ao clicar em "Rejeitar", abrir modal solicitando motivo.
        *   O autor recebe um e-mail com a justificativa, mas a ideia fica arquivada (não deletada).

## Requisitos Não-Funcionais (NFR)

1.  **Segurança e Privacidade (GDPR/LGPD):**
    *   Ideias rejeitadas ou arquivadas devem ter opção de anonimização se solicitado pelo autor.
    *   Todas as senhas devem ser hashadas (bcrypt/Argon2).
2.  **Performance:**
    *   O tempo de carregamento do Dashboard principal não deve exceder 200ms (Time to First Byte) e 1s para renderização completa (LCP).
    *   O sistema deve suportar 500 usuários simultâneos sem degradação perceptível.
3.  **Acessibilidade:**
    *   A interface deve estar em conformidade com WCAG 2.1 Nível AA.
    *   Todos os campos de formulário devem ter labels associados e suporte a navegação por teclado.
4.  **Disponibilidade:**
    *   O sistema deve operar com SLA de 99.9% durante horário comercial.
