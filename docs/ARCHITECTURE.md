# Arquitetura do Sistema

Este documento apresenta os diagramas estruturais e comportamentais da plataforma.

## 1. Diagrama de Entidade-Relacionamento (ERD)

Representação do modelo de dados relacional (PostgreSQL).

```mermaid
erDiagram
    USERS ||--o{ IDEAS : "creates"
    USERS ||--o{ COMMENTS : "writes"
    USERS ||--o{ VOTES : "casts"
    USERS ||--o{ CAMPAIGNS : "manages"

    CAMPAIGNS ||--o{ IDEAS : "organizes"

    IDEAS ||--o{ COMMENTS : "has"
    IDEAS ||--o{ VOTES : "receives"
    IDEAS }|--|{ TAGS : "categorized_by"

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        enum role "admin, innovator, technical"
        int xp_points
        json badges
    }

    CAMPAIGNS {
        uuid id PK
        string title
        text description
        datetime start_date
        datetime end_date
        bool is_active
    }

    IDEAS {
        uuid id PK
        string title
        text description_markdown
        string attachment_url
        enum status "draft, submitted, screening, analysis, approved, rejected"
        enum horizon "H1, H2, H3"
        datetime created_at
        uuid author_id FK
        uuid campaign_id FK
    }

    COMMENTS {
        uuid id PK
        text content
        datetime created_at
        uuid author_id FK
        uuid idea_id FK
    }

    VOTES {
        uuid user_id PK, FK
        uuid idea_id PK, FK
        int weight
        datetime created_at
    }

    TAGS {
        uuid id PK
        string name
        string color_hex
    }
```

## 2. Diagrama de Sequência: Submissão de Ideia

Fluxo detalhado desde a ação do usuário até a notificação dos gestores.

```mermaid
sequenceDiagram
    participant U as User (Innovator)
    participant FE as Frontend (React)
    participant API as Backend API (FastAPI)
    participant DB as Database (PostgreSQL)
    participant NOTIF as Notification Service (Background Job)
    participant M as Manager (Admin)

    U->>FE: Clica em "Nova Ideia" e preenche form
    U->>FE: Seleciona Campanha e Anexa Arquivo
    FE->>FE: Valida tamanho do arquivo e campos
    FE->>API: POST /ideas (Payload JSON + Token JWT)

    activate API
    API->>API: Valida Token e Permissões
    API->>DB: INSERT INTO ideas (status='submitted')
    activate DB
    DB-->>API: Retorna Idea ID
    deactivate DB

    API->>NOTIF: Enfileira Job: NotifyManagers(new_idea_id)
    API-->>FE: 201 Created (Idea Object)
    deactivate API

    FE-->>U: Exibe mensagem de sucesso e redireciona

    activate NOTIF
    NOTIF->>DB: SELECT * FROM users WHERE role='admin'
    DB-->>NOTIF: Lista de emails dos gestores
    NOTIF->>M: Envia Email: "Nova ideia submetida: [Titulo]"
    deactivate NOTIF
```
