# Manual de Instalação, Configuração e Uso do Projeto Idea Bank

Olá! Este manual foi criado para guiar você, que está começando no mundo da programação, a instalar, configurar e rodar o projeto "Idea Bank" em sua máquina local. Vamos passar por cada etapa, do zero ao projeto funcionando!

## Estrutura do Manual

O manual está organizado em níveis de prioridade. Siga a ordem para garantir que tudo funcione corretamente.

1.  **Nível 1: Pré-requisitos:** Instalação das ferramentas essenciais.
2.  **Nível 2: Banco de Dados:** Configuração do PostgreSQL, o cérebro que armazena os dados.
3.  **Nível 3: Backend:** Configuração do servidor que processa as informações (a API).
4.  **Nível 4: Frontend:** Configuração da interface com a qual o usuário interage (o site).
5.  **Nível 5: Testes e Uso:** Como verificar se tudo está funcionando e como usar a aplicação.

---

### Nível 1: Pré-requisitos (Software Essencial)

Antes de começar, você precisa ter algumas ferramentas instaladas em seu computador.

#### 1. Git (Sistema de Controle de Versão)

O Git é usado para baixar o código do repositório.

*   **Como instalar:**
    *   Acesse [git-scm.com/downloads](https://git-scm.com/downloads) e baixe a versão para o seu sistema operacional (Windows, macOS ou Linux).
    *   Siga as instruções do instalador. Você pode aceitar todas as opções padrão.
*   **Como baixar o projeto:**
    *   Abra um terminal (no Windows, pode ser o "Git Bash" que vem com o Git; no macOS ou Linux, o "Terminal").
    *   Navegue até a pasta onde você quer salvar o projeto (ex: `cd Documentos/Projetos`).
    *   Clone o repositório com o comando:
        ```bash
        git clone <URL_DO_REPOSITORIO>
        ```
        (Substitua `<URL_DO_REPOSITORIO>` pela URL que você usou para obter este projeto).
    *   Entre na pasta do projeto: `cd <NOME_DA_PASTA_DO_PROJETO>`

#### 2. Python (Linguagem do Backend)

O backend do nosso projeto usa a linguagem Python com o framework Django.

*   **Como instalar:**
    *   Acesse [python.org/downloads/](https://python.org/downloads/) e baixe a versão 3.12 ou superior.
    *   **Importante (para Windows):** Na primeira tela da instalação, marque a caixa que diz **"Add Python to PATH"**. Isso facilitará muito o uso!
    *   Para verificar se a instalação funcionou, abra um novo terminal e digite: `python --version`.

#### 3. Node.js e npm (Ambiente do Frontend)

O frontend usa JavaScript com a biblioteca React. O Node.js nos permite rodar esse ambiente, e o npm (que vem junto com o Node.js) gerencia as "peças" (pacotes) do frontend.

*   **Como instalar:**
    *   Acesse [nodejs.org](httpss://nodejs.org/en/) e baixe a versão LTS (Long Term Support), que é a mais estável.
    *   Siga os passos do instalador.
    *   Para verificar, abra um novo terminal e digite: `node --version` e `npm --version`.

#### 4. PostgreSQL (Banco de Dados)

Este é o sistema que vai armazenar todas as informações da aplicação, como ideias, usuários, etc.

*   **Como instalar:**
    *   Acesse [postgresql.org/download/](https://www.postgresql.org/download/) e escolha seu sistema operacional.
    *   Siga o guia de instalação. Durante a instalação, será solicitado que você defina uma **senha para o superusuário (postgres)**. **Anote essa senha!** Você precisará dela em breve.
    *   O instalador pode oferecer a instalação de ferramentas adicionais via "Stack Builder". Você pode pular essa etapa desmarcando a opção no final da instalação.

---

### Nível 2: Configuração do Banco de Dados (PostgreSQL)

Com o PostgreSQL instalado, precisamos criar o banco de dados específico para este projeto.

1.  **Abra uma ferramenta de administração do PostgreSQL.** Normalmente, o `pgAdmin` (para interface gráfica) ou o `psql` (para linha de comando) são instalados juntos. O `psql` é mais direto.

2.  **Crie o banco de dados e o usuário:**
    *   Abra um terminal e execute o `psql` como superusuário. Você precisará da senha que definiu na instalação.
        ```bash
        psql -U postgres
        ```
    *   Dentro do `psql`, execute os seguintes comandos, um de cada vez, pressionando Enter após cada um. Estes dados (nome do banco, usuário e senha) são os mesmos que estão no arquivo de configuração do projeto (`backend/idea_bank/settings.py`).

        ```sql
        -- 1. Crie um novo usuário (role) com a senha especificada.
        CREATE ROLE user WITH LOGIN PASSWORD 'password';

        -- 2. Crie o banco de dados.
        CREATE DATABASE idea_bank;

        -- 3. Dê ao seu novo usuário todas as permissões no novo banco de dados.
        GRANT ALL PRIVILEGES ON DATABASE idea_bank TO user;

        -- 4. Saia do psql.
        \q
        ```

Pronto! Seu banco de dados está preparado para receber as informações do projeto.

---

### Nível 3: Configuração do Backend (Servidor Django)

Agora vamos configurar a parte "inteligente" do projeto.

1.  **Navegue até a pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Crie e ative um ambiente virtual (Virtual Environment):**
    Isso cria uma "caixa" isolada para as dependências do Python deste projeto, evitando conflitos.
    ```bash
    # Cria o ambiente virtual (a pasta venv)
    python -m venv venv

    # Ativa o ambiente
    # No Windows:
    .\venv\Scripts\activate
    # No macOS/Linux:
    source venv/bin/activate
    ```
    Você saberá que funcionou porque o nome do ambiente `(venv)` aparecerá no início da linha do seu terminal.

3.  **Instale as dependências do Python:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Aplique as "migrações" (Migrations):**
    Este comando cria as tabelas (como as planilhas do Excel) dentro do banco de dados que preparamos.
    ```bash
    python manage.py migrate
    ```

5.  **Crie um superusuário:**
    Este usuário terá acesso ao painel de administração do Django.
    ```bash
    python manage.py createsuperuser
    ```
    Siga as instruções para criar um nome de usuário, e-mail e senha.

6.  **Inicie o servidor do backend:**
    ```bash
    python manage.py runserver
    ```
    Se tudo deu certo, você verá uma mensagem indicando que o servidor está rodando em `http://127.0.0.1:8000/`. **Deixe este terminal aberto e rodando!**

---

### Nível 4: Configuração do Frontend (Interface React)

Agora vamos configurar a parte visual do projeto.

1.  **Abra um NOVO terminal.** Não feche o terminal onde o backend está rodando!

2.  **Navegue até a pasta do frontend:**
    ```bash
    # Se você ainda estiver na pasta 'backend', suba um nível
    cd ..
    # Agora entre na pasta frontend
    cd frontend
    ```

3.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor do frontend:**
    ```bash
    npm start
    ```
    Seu navegador deve abrir automaticamente com a página `http://localhost:3000`. Se não abrir, você pode acessar essa URL manualmente.

---

### Nível 5: Testando a Aplicação e Como Usar

Se você chegou até aqui, seu ambiente está completo!

*   **Frontend (Site):** Acesse `http://localhost:3000` no seu navegador. Você deve ver a página inicial do "Idea Bank". Tente navegar, criar uma conta e submeter uma ideia.
*   **Backend (API):** O frontend se comunica automaticamente com o backend em `http://localhost:8000`. Você não precisa acessar essa URL diretamente, mas é bom saber que ela está lá.
*   **Painel de Administração:** Acesse `http://localhost:8000/admin`. Use o superusuário que você criou para fazer login. Aqui você pode ver e gerenciar todas as ideias e usuários cadastrados no sistema.

### Fluxo de Trabalho para Iniciantes

*   O código do **backend** fica na pasta `backend/`. Se quiser alterar a lógica da API, é aqui que você vai mexer.
*   O código do **frontend** fica na pasta `frontend/src/`. Se quiser alterar a aparência do site, as páginas, os botões, etc., é aqui que você vai mexer.
*   Sempre que fizer uma alteração no frontend e salvar o arquivo, a página no seu navegador (`localhost:3000`) irá recarregar automaticamente para mostrar a mudança!
*   Lembre-se de sempre ter os **dois servidores rodando** em terminais separados para que a aplicação funcione por completo.

Parabéns! Você configurou um projeto web completo. Explore o código, faça pequenas alterações e veja o que acontece. Essa é a melhor forma de aprender!
