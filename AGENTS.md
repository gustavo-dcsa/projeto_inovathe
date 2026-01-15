# AGENTS.md - Diretrizes para o Agente de Inovação

## 1. Visão Geral

Este é um monorepo para uma Plataforma de Gestão de Inovação.

* **Backend:** Python/FastAPI em /backend
* **Frontend:** React/Vite em /frontend
* **Banco:** PostgreSQL

## 2. Comandos de Ambiente (Use estes para verificar seu trabalho)

* **Instalar Backend:** `cd backend && pip install -r requirements.txt`
* **Rodar Backend:** `cd backend && uvicorn app.main:app --reload`
* **Testar Backend:** `cd backend && pytest`
* **Instalar Frontend:** `cd frontend && npm install`
* **Rodar Frontend:** `cd frontend && npm run dev`
* **Testar Frontend:** `cd frontend && npm test`

## 3. Padrões de Código e Arquitetura

### Backend

* Utilize **sempre** tipagem estática (Type Hints).
* Validação de dados **exclusivamente** via Pydantic Schemas.
* NUNCA exponha o hash de senha nos schemas de resposta (UserResponse).
* Use `await` para todas as chamadas de banco de dados (SQLAlchemy Async).
* Estrutura de pastas estrita: `app/routers` para endpoints, `app/crud` para queries.

### Frontend

* Componentes funcionais com Hooks. Proibido Class Components.
* Use kebab-case para nomes de arquivos de componentes (ex: `idea-card.tsx`).
* Estilização deve usar classes utilitárias do Tailwind. Evite CSS modules a menos que estritamente necessário.
* Tratamento de erros de API deve ser centralizado ou usar ErrorBoundary.

## 4. Limites de Atuação

* Você pode criar novas migrações do Alembic, mas **não delete** migrações existentes sem permissão explícita.
* Não altere o arquivo `render.yaml` a menos que solicitado especificamente na tarefa de DevOps.
