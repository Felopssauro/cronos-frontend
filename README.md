# Cronos Frontend

Interface web do SCA UEPA (React + Vite).

## Contribuindo

### Pré-requisitos

- Docker
- Docker Compose

### Desenvolvimento com Docker

Execute a partir da raiz do repositório (`cronos-webapp/`) ou utilize o mesmo comando para subir o container apenas do frontend:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

### Variáveis de ambiente

Definidas no compose de desenvolvimento:

- `VITE_API_BASE_URL`

É necessário criar um arquivo `.env` com essa variável, pois é a responsável pela conexão com o backend.

### Estrutura

- `src/App.jsx`: fluxo principal e estado de autenticação (localStorage).
- `src/components/`: componentes de UI e fluxos de tela.
- `src/data/`, `src/utils/`, `src/assets/`: dados, utilidades e assets.

### Convenções

- Componentes React organizados por pasta.
- Estado e autenticação via hooks e `localStorage`.
