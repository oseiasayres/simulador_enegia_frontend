# Deploy — Simulador de Energia (Hetzner + Docker Compose)

Sobe **frontend + backend** em um único servidor. O Caddy serve o site e faz
proxy de `/api` para o backend (mesma origem, sem CORS).

```
Internet :80  ─►  Caddy (web)  ─►  frontend estático (SPA)
                       └── /api/*, /docs ─►  backend (uvicorn :8000)
```

---

## 1. Criar a conta e o servidor na Hetzner

1. Crie a conta em https://www.hetzner.com/cloud (precisa de cartão; a validação
   pode pedir um documento).
2. No Cloud Console: **New Project** → dentro dele **Add Server**.
   - **Location:** Ashburn (EUA) ou Falkenstein (Alemanha). *(A Hetzner Cloud não
     tem região no Brasil; a latência do BR é menor para os EUA.)*
   - **Image:** Ubuntu 24.04
   - **Type:** Shared vCPU → **CX22** (2 vCPU / 4 GB) já sobra para essa app
     (≈ €4/mês). Dá para começar no CX22 e redimensionar depois.
   - **SSH Key:** adicione sua chave pública (recomendado). Se não tiver:
     `ssh-keygen -t ed25519` e cole o conteúdo de `~/.ssh/id_ed25519.pub`.
   - **Firewalls:** crie um firewall liberando **inbound TCP 22 (SSH)** e
     **80 (HTTP)** — e **443** também, já pensando no HTTPS futuro.
   - Crie o servidor e anote o **IP público**.

---

## 2. Preparar o servidor (Docker)

SSH no servidor:

```bash
ssh root@IP_DO_SERVIDOR
```

Instale o Docker + plugin do Compose:

```bash
curl -fsSL https://get.docker.com | sh
```

(Opcional, rodar sem `sudo` como usuário não-root: `usermod -aG docker $USER` e reloga.)

---

## 3. Clonar os dois repositórios (lado a lado)

O `docker-compose.yml` espera os dois repos no **mesmo diretório pai**:

```bash
mkdir -p ~/apps && cd ~/apps
git clone https://github.com/oseiasayres/simulador_energia_backend.git
git clone https://github.com/oseiasayres/simulador_enegia_frontend.git
```

> Repositórios privados: gere um token no GitHub e use
> `https://TOKEN@github.com/oseiasayres/...`, ou configure uma deploy key.

---

## 4. Subir

```bash
cd ~/apps/simulador_enegia_frontend
docker compose up -d --build
```

Acesse **http://IP_DO_SERVIDOR**
- Frontend: `/`
- API docs: `/docs`
- Health: `/api/v1/health`

Ver logs / status:

```bash
docker compose ps
docker compose logs -f
```

---

## 5. Atualizar depois de um push

```bash
cd ~/apps/simulador_enegia_frontend && git pull
cd ~/apps/simulador_energia_backend  && git pull
cd ~/apps/simulador_enegia_frontend
docker compose up -d --build
```

Parar tudo: `docker compose down`

---

## 6. Adicionar domínio + HTTPS (quando tiver)

1. Aponte um registro **A** do domínio para o IP do servidor.
2. No `Caddyfile`, troque a primeira linha `:80 {` por `seu.dominio.com {`.
3. `docker compose up -d --build`.

O Caddy emite e renova o certificado (Let's Encrypt) sozinho — nada mais a fazer.
Garanta que a porta **443** está liberada no firewall.

---

## Notas

- Hoje o **frontend calcula tudo localmente** (`src/calc.ts`); o backend sobe junto
  e fica disponível em `/api`, mas o front ainda não o consome. Integrar os
  cálculos no servidor é um passo separado.
- O bundle do front passa de 500 kB (aviso do Vite). Funciona normalmente; dá para
  otimizar com code-splitting depois, se quiser.
