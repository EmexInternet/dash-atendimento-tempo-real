# dash-atendimento-tempo-real

Dashboard interno da Emex Internet para acompanhamento em tempo real dos indicadores de atendimento, URA, fila, agentes, chamadas e churn.

O projeto utiliza React para exibir um painel visual em tela cheia, consumindo dados da plataforma de telefonia/URA, API interna de indicadores operacionais e, de forma experimental, dados de fila do SZ Chat.

> Nome anterior/repositório de origem: `NewDashboard`.

## O que este projeto faz

- Sobe uma aplicação frontend em React.
- Utiliza Create React App como base de execução e build.
- Exibe painel responsivo em tela cheia.
- Ajusta dimensões do dashboard conforme altura e largura da janela.
- Consulta dados da plataforma Newave/URA.
- Consulta fila de chamadas em espera.
- Consulta estatísticas de chamadas do dia.
- Consulta tempo médio de atendimento.
- Consulta tempo médio de espera.
- Consulta nível de serviço.
- Consulta agentes logados.
- Classifica agentes por status: pausado, em ligação ou disponível.
- Exibe os principais agentes em cards visuais.
- Consulta melhor agente por avaliação.
- Consulta notificações operacionais em API interna.
- Consulta indicador de churn em API interna.
- Exibe gauge visual de churn realizado, teto e projeção.
- Possui componente experimental para fila SZ Chat.
- Possui componente placeholder para Fluctus.
- Usa carrossel para alternar grupos de indicadores.
- Usa imagem institucional da Emex em `public/LogoEmex.png`.
- Mantém dados de exemplo em arquivos JSON locais.
- Está preparado para uso em monitores internos, NOC, Atendimento, CX/CS ou áreas de acompanhamento operacional.

## Módulos disponíveis

### Dashboard URA

Componente principal:

```text
src/Components/Ura/Ura.js
```

Status:

```text
ativo
```

Objetivo:

- exibir fila URA;
- exibir quantidade de chamadas na fila;
- exibir tempo de espera por ligação;
- exibir TMA;
- exibir TME;
- exibir melhor avaliação;
- exibir chamadas recebidas;
- exibir chamadas atendidas;
- exibir chamadas abandonadas;
- exibir nível de serviço;
- exibir agentes online;
- exibir agentes em linha;
- exibir agentes disponíveis;
- exibir agentes pausados;
- exibir gauge de churn;
- exibir lista de agentes com tempo no status atual.

APIs consumidas:

```text
Newave / URA
API interna Emex na porta 3001
```

Arquivos principais:

```text
src/Components/Ura/Ura.js
src/Components/Ura/Api.js
src/Components/Ura/GaugeComponent.js
src/Components/Ura/App.css
```

---

### Dashboard SZ Chat

Componente:

```text
src/Components/Sz/Sz.js
```

Status:

```text
experimental/parcial
```

Objetivo:

- exibir fila do SZ Chat;
- classificar atendimento por canal;
- exibir ícones de WhatsApp, Instagram, Messenger ou canal desconhecido;
- exibir nome ou número do cliente;
- exibir campanha vinculada;
- calcular tempo de espera com base em eventos do atendimento.

Observação:

```text
No estado atual, o componente usa dados locais de src/fila.json.
Parte da integração real com API SZ Chat está comentada no código.
```

Arquivos principais:

```text
src/Components/Sz/Sz.js
src/Components/Sz/Api.js
src/Components/Sz/API.js
src/Components/Sz/App.css
src/fila.json
```

---

### Dashboard Fluctus

Componente:

```text
src/Components/Fluctus/Fluctus.js
```

Status:

```text
placeholder
```

Objetivo atual:

- manter estrutura inicial para futura tela Fluctus;
- componente ainda retorna apenas `hello world`.

Arquivos principais:

```text
src/Components/Fluctus/Fluctus.js
src/Components/Fluctus/Api.js
src/Components/Fluctus/App.css
```

## Estrutura principal da aplicação

Arquivo principal:

```text
src/App.js
```

Responsável por:

- calcular dimensões da janela;
- atualizar dimensões após redimensionamento;
- renderizar o dashboard principal;
- manter estrutura comentada para alternância futura entre dashboards via carrossel.

No estado atual, o componente renderizado é:

```text
Ura
```

Estrutura futura já prevista no código:

```text
Carousel
→ Ura
→ Fluctus
```

## Estrutura da fila URA

Exemplo simplificado de item retornado pela fila da URA:

```json
{
  "queue": "Atendimento",
  "src": "24999999999",
  "wait": 120,
  "linkdid": "identificador-da-ligacao"
}
```

Campos utilizados pelo dashboard:

```text
queue
src
wait
linkdid
```

Uso no painel:

```text
queue   → nome da fila
src     → telefone/origem da chamada
wait    → tempo de espera formatado
linkdid → chave usada na renderização da lista
```

## Estrutura dos indicadores de chamadas

Exemplo simplificado de estrutura consumida pelo dashboard:

```json
{
  "result": {
    "stats": {
      "stats_all": {
        "queues": {
          "Atendimento": {
            "counts": {
              "incoming": {
                "start_of_this": {
                  "day": 0
                }
              },
              "incoming_answer": {
                "start_of_this": {
                  "day": 0
                }
              },
              "incoming_lost": {
                "start_of_this": {
                  "day": 0
                }
              }
            }
          }
        }
      },
      "avgs": {
        "talk_time": {
          "start_of_this": {
            "day": {
              "avg": 0
            }
          }
        }
      }
    }
  }
}
```

Filas consideradas no cálculo:

```text
Atendimento
Suporte
Comercial
TransbordoAtendComercial
```

Indicadores calculados:

```text
recebidas
atendidas
abandonadas
TMA
TME
nível de serviço
```

## Estrutura dos agentes

Exemplo simplificado de agente retornado pela URA:

```json
{
  "exten": "1001",
  "status": "available",
  "is_paused": false,
  "updated_at": 1715000000000,
  "agent": {
    "name": "Agente Exemplo"
  }
}
```

Status tratados pelo dashboard:

```text
available  → disponível
incall     → em ligação
is_paused  → pausado
```

O painel ordena os agentes priorizando:

```text
pausados
em ligação
disponíveis
tempo no status atual
```

## Estrutura do churn

Exemplo simplificado do retorno esperado da API interna:

```json
[
  {
    "churn": 2.1,
    "churn_relativo": 2.5,
    "projecao_churn": 2.8
  }
]
```

Campos utilizados:

```text
churn
churn_relativo
projecao_churn
```

Uso no painel:

```text
churn          → valor atual exibido no gauge
churn_relativo → teto/base de comparação
projecao_churn → projeção exibida abaixo do gauge
```

## Estrutura da fila SZ Chat

Exemplo simplificado de item usado no componente SZ:

```json
{
  "_id": "id-do-atendimento",
  "name": "Cliente Exemplo",
  "platform": "WhatsappBusiness",
  "platform_id": "5524999999999",
  "protocol": "202605070001",
  "campaign_id": "6047f56db4f2bb003126438d",
  "status": "wait",
  "events": [
    {
      "event": "waitStart",
      "created_at": "2026-05-07 08:00:00"
    }
  ]
}
```

Canais tratados:

```text
Whatsapp
WhatsappBusiness
InstagramDirect
Messenger
desconhecido
```

Campanhas mapeadas no componente:

```text
6047f56db4f2bb003126438d → Atendimento
6047f56db4f2bb003126438f → Comercial
6047f56db4f2bb003126438e → Suporte
6245dfaf0a995e2216156bfc → Suporte Avançado
```

## Como executar

### 1. Instalar dependências

Na raiz do projeto:

```bash
npm install
```

### 2. Criar arquivo de ambiente

Crie um arquivo `.env.local` na raiz do projeto.

Exemplo:

```env
REACT_APP_USERNAME=
REACT_APP_PASSWORD=
REACT_APP_EMAIL=
REACT_APP_PASS=
```

Atenção:

```text
não inserir credenciais reais de produção em frontend
não versionar .env
não versionar .env.local
```

### 3. Executar em ambiente local

```bash
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

### 4. Executar testes

```bash
npm test
```

### 5. Gerar build de produção

```bash
npm run build
```

O build final será salvo em:

```text
build/
```

## Scripts disponíveis

### `npm start`

Executa a aplicação em modo desenvolvimento.

```bash
npm start
```

### `npm run build`

Gera a versão de produção.

```bash
npm run build
```

### `npm test`

Executa o ambiente de testes padrão do Create React App.

```bash
npm test
```

### `npm run eject`

Remove a abstração do Create React App.

```bash
npm run eject
```

Atenção:

```text
não executar npm run eject sem necessidade real
essa ação é difícil de reverter
```

## Arquivos principais

```text
dash-atendimento-tempo-real/
├── .env
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── public/
│   ├── LogoEmex.png
│   ├── favicon.ico
│   └── index.html
└── src/
    ├── App.css
    ├── App.js
    ├── index.css
    ├── index.js
    ├── fila.json
    ├── Untitled-1.json
    └── Components/
        ├── Ura/
        │   ├── Api.js
        │   ├── App.css
        │   ├── GaugeComponent.js
        │   └── Ura.js
        ├── Sz/
        │   ├── API.js
        │   ├── Api.js
        │   ├── App.css
        │   └── Sz.js
        └── Fluctus/
            ├── Api.js
            ├── App.css
            └── Fluctus.js
```

### `src/App.js`

Arquivo principal da aplicação.

Responsável por:

```text
calcular dimensões da tela
monitorar resize da janela
renderizar o dashboard ativo
manter estrutura futura para carrossel entre dashboards
```

### `src/Components/Ura/Api.js`

Configura cliente Axios para integração com a API Newave/URA.

Atualmente usa:

```text
baseURL fixa
basic auth com REACT_APP_USERNAME e REACT_APP_PASSWORD
```

Ajuste recomendado:

```text
migrar baseURL para variável de ambiente
não usar credenciais sensíveis no frontend
criar backend intermediário para autenticação
```

### `src/Components/Ura/Ura.js`

Componente principal do dashboard.

Responsável por:

```text
consultar fila
consultar indicadores de chamadas
consultar agentes
consultar melhor agente
consultar churn
consultar notificações
formatar tempos
ordenar agentes
renderizar cards visuais
renderizar gauge de churn
```

### `src/Components/Ura/GaugeComponent.js`

Componente visual para exibição do churn em formato de velocímetro.

Responsável por:

```text
receber mínimo, médio, máximo e valor atual
renderizar gauge semicircular
exibir projeção de churn
```

### `src/Components/Sz/Sz.js`

Componente experimental para fila SZ Chat.

Responsável por:

```text
ler fila local
calcular tempo de espera
identificar canal do atendimento
identificar campanha
renderizar cards de fila digital
```

### `src/Components/Sz/Api.js` e `src/Components/Sz/API.js`

Clientes Axios para API SZ Chat.

Atenção:

```text
há duplicidade de arquivo
a integração usa cors-anywhere
parte do consumo real está comentada
deve ser revisada antes de uso em produção
```

### `src/Components/Fluctus/Fluctus.js`

Componente placeholder.

Responsável atualmente por:

```text
renderizar texto simples de teste
```

### `src/fila.json`

Arquivo local de exemplo usado pelo componente SZ.

Pode ser usado para:

```text
teste visual
simulação de fila
validação sem API externa
```

### `src/Untitled-1.json`

Arquivo JSON local de apoio/teste.

Deve ser revisado para confirmar se ainda é necessário.

## Fontes de dados utilizadas

O projeto utiliza ou prevê uso das seguintes fontes:

```text
Newave / URA
API interna Emex
SZ Chat
JSON local de simulação
```

### Newave / URA

Usada para:

```text
fila de chamadas
estatísticas de chamadas
tempo médio de atendimento
tempo médio de espera
nível de serviço
agentes logados
melhor agente
```

Endpoints chamados no código:

```text
../monitor/calls_in_queue
../dashboard/supervisor
../monitor/stats_summary
../monitor/extens
../dashboard/agents
```

### API interna Emex

Usada para:

```text
notificações operacionais
indicadores de churn
```

Endpoints chamados no código:

```text
/db
/churn
```

Atenção:

```text
a URL da API interna está fixa no código
deve ser migrada para variável de ambiente
```

### SZ Chat

Previsto para:

```text
fila de atendimento digital
login na API
consulta de atendimentos por fase
```

Status atual:

```text
integração parcial/comentada
uso de JSON local para simulação
```

### JSON local

Arquivos:

```text
src/fila.json
src/Untitled-1.json
```

Uso:

```text
simulação de fila
validação visual sem depender da API
```

## Arquivos gerados

Ao executar:

```bash
npm run build
```

o projeto gera:

```text
build/
```

Principais saídas:

```text
build/index.html
build/static/js/
build/static/css/
build/static/media/
```

A pasta `build/` deve ser usada para publicação em ambiente web.

A pasta `build/` não deve ser versionada.

## Fluxo piloto completo

Para validar o projeto em modo seguro, siga a sequência abaixo.

### 1. Renomear o repositório

Nome recomendado:

```text
dash-atendimento-tempo-real
```

### 2. Remover credenciais do repositório

Antes de qualquer publicação:

```text
remover .env do repositório
trocar credenciais expostas
criar .env.example sem valores reais
garantir .env no .gitignore
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Criar `.env.local`

```env
REACT_APP_USERNAME=
REACT_APP_PASSWORD=
REACT_APP_EMAIL=
REACT_APP_PASS=
```

### 5. Executar localmente

```bash
npm start
```

Acessar:

```text
http://localhost:3000
```

### 6. Validar carregamento visual

Conferir:

```text
logo Emex
fila URA
cards de indicadores
gauge de churn
lista de agentes
responsividade em tela cheia
```

### 7. Validar chamadas da URA

No navegador, abrir o console e aba Network.

Conferir chamadas para:

```text
monitor/calls_in_queue
dashboard/supervisor
monitor/stats_summary
monitor/extens
dashboard/agents
```

### 8. Validar API interna

Conferir chamadas para:

```text
/db
/churn
```

### 9. Validar comportamento sem dados

Simular indisponibilidade de API e confirmar:

```text
se a tela não quebra
se erros aparecem no console
se o painel continua carregando
se há necessidade de fallback visual
```

### 10. Gerar build

```bash
npm run build
```

### 11. Validar build local

Opcionalmente, instalar servidor estático:

```bash
npm install -g serve
```

Executar:

```bash
serve -s build
```

Acessar endereço exibido no terminal.

## Validação sem integrações externas

O projeto depende das APIs externas para exibir os indicadores reais.

Mesmo assim, é possível validar parte do projeto sem integrações.

### Validação visual

```bash
npm start
```

Validar:

```text
carregamento da aplicação
responsividade
logo
estrutura dos cards
CSS principal
ausência de erro crítico de renderização
```

### Validação do componente SZ com JSON local

O componente SZ pode usar:

```text
src/fila.json
```

Para ativar a tela SZ, será necessário alterar temporariamente `src/App.js` para renderizar:

```jsx
<Sz height={windowDimensions.height} width={windowDimensions.width}/>
```

### Validação de build

```bash
npm run build
```

Essa etapa valida:

```text
compilação
imports
dependências
assets públicos
estrutura final de produção
```

## Deploy

O projeto gera uma aplicação estática React.

Fluxo padrão:

```bash
npm run build
```

Publicar o conteúdo da pasta:

```text
build/
```

em um servidor web, como:

```text
Nginx
Apache
Hostinger
VPS
servidor interno
```

Atenção:

```text
este projeto não possui backend próprio
qualquer segredo usado no frontend pode ficar exposto no build
```

## Análise com IA

Este projeto não executa análise com IA diretamente.

No futuro, pode ser integrado a uma camada de IA para:

```text
explicar variações nos indicadores de atendimento
detectar anomalias em fila ou abandono
gerar resumo diário de operação
identificar horários críticos
correlacionar churn com atendimento
sugerir escala com base em fila e TME
alertar sobre queda no nível de serviço
resumir desempenho de agentes
```

Fluxo sugerido para integração futura:

```text
URA / API interna / SZ Chat
→ normalização de dados
→ dashboard em tempo real
→ análise opcional com IA
→ alerta gerencial ou relatório executivo
```

## Importante

- O projeto é um frontend React baseado em Create React App.
- O nome atual no `package.json` está como `sz` e deve ser ajustado.
- Nome recomendado do repositório: `dash-atendimento-tempo-real`.
- O projeto possui arquivo `.env` no ZIP original.
- O `.env` possui credenciais e não deve ser versionado.
- O `.gitignore` atual ignora `.env.local`, mas não ignora explicitamente `.env`.
- Variáveis `REACT_APP_*` ficam expostas no build final.
- Não é seguro armazenar usuário, senha, token ou segredo no frontend.
- A URL da API interna está fixa no código.
- A URL da API Newave/URA está fixa no código.
- A integração SZ usa `cors-anywhere`, solução paliativa que não deve ser usada como arquitetura definitiva.
- Há arquivos duplicados em `src/Components/Sz/API.js` e `src/Components/Sz/Api.js`.
- O componente Fluctus ainda é placeholder.
- O componente SZ está parcial e usa JSON local.
- O `App.js` atualmente renderiza apenas o componente `Ura`.
- Existem trechos comentados de carrossel entre dashboards.
- O projeto usa `<body>` dentro de componentes React, prática que deve ser revisada.
- Existem múltiplos `setInterval` sem limpeza explícita em alguns `useEffect`.
- Existem chamadas diretas com IP público no frontend.
- O projeto não possui backend intermediário para proteger credenciais.
- O projeto não possui tratamento padronizado de erro nas requisições.
- O projeto não possui fallback visual para APIs indisponíveis.
- O projeto não possui testes automatizados específicos.
- O projeto precisa de revisão de segurança antes de publicação externa.

## Ajustes pendentes na arquitetura

- Renomear repositório para `dash-atendimento-tempo-real`.
- Ajustar `"name"` no `package.json` de `sz` para `dash-atendimento-tempo-real`.
- Remover `.env` do repositório.
- Trocar credenciais expostas.
- Criar `.env.example` sem valores reais.
- Adicionar `.env` ao `.gitignore`.
- Migrar URLs fixas para variáveis de ambiente.
- Criar backend intermediário para autenticação nas APIs.
- Remover credenciais do frontend.
- Substituir uso de `cors-anywhere` por proxy/backend próprio.
- Corrigir duplicidade entre `API.js` e `Api.js` no módulo SZ.
- Decidir se o SZ Chat será mantido neste projeto ou separado em outro dashboard.
- Decidir se o Fluctus será implementado ou removido.
- Criar camada central de configuração.
- Criar camada central de serviços HTTP.
- Criar tratamento padronizado de erro.
- Criar estados de loading, erro e sem dados.
- Criar fallback quando URA, API interna ou SZ estiverem indisponíveis.
- Corrigir `useEffect` com `setInterval` para limpar intervalos no desmontar do componente.
- Revisar uso de `<body>` dentro de componentes React.
- Separar cálculo de indicadores da camada visual.
- Padronizar nomes de variáveis.
- Padronizar nomes de componentes.
- Criar componentes reutilizáveis para cards de indicador.
- Criar componente reutilizável para lista de agentes.
- Criar componente reutilizável para fila.
- Criar componente reutilizável para status de API.
- Criar testes básicos de renderização.
- Criar documentação de deploy.
- Criar documentação das APIs consumidas.
- Criar documentação dos indicadores exibidos.
- Atualizar layout para aderência completa ao manual da marca Emex.
- Revisar acessibilidade visual em monitores grandes.
- Criar versão de homologação com dados mockados.
- Criar modo demo sem APIs reais.
- Criar changelog para alterações de indicadores.

## Sugestão de `.env.example`

Criar arquivo `.env.example` na raiz:

```env
# Newave / URA
REACT_APP_URA_API_URL=
REACT_APP_USERNAME=
REACT_APP_PASSWORD=

# API interna Emex
REACT_APP_INTERNAL_API_URL=

# SZ Chat
REACT_APP_SZ_API_URL=
REACT_APP_EMAIL=
REACT_APP_PASS=

# Ambiente
REACT_APP_ENV=development
```

Atenção:

```text
este .env.example deve conter somente nomes de variáveis
não inserir valores reais
não inserir senhas
não inserir tokens
não inserir IPs sensíveis
```

## Sugestão de `.gitignore`

Atualizar o `.gitignore` para incluir:

```gitignore
# Dependências
/node_modules
/.pnp
.pnp.js

# Testes
/coverage

# Build
/build

# Ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Sistema operacional
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

## Sugestão de estrutura futura

Estrutura recomendada para evolução:

```text
dash-atendimento-tempo-real/
├── public/
│   ├── LogoEmex.png
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   ├── config/
│   │   └── env.js
│   ├── services/
│   │   ├── uraApi.js
│   │   ├── internalApi.js
│   │   └── szApi.js
│   ├── components/
│   │   ├── IndicatorCard/
│   │   ├── AgentList/
│   │   ├── QueueList/
│   │   ├── ChurnGauge/
│   │   └── StatusBadge/
│   ├── dashboards/
│   │   ├── UraDashboard/
│   │   ├── SzDashboard/
│   │   └── FluctusDashboard/
│   ├── mocks/
│   │   ├── fila-ura.json
│   │   └── fila-sz.json
│   └── styles/
│       └── theme.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Sugestão de backend intermediário

Para produção, recomenda-se que o frontend não chame diretamente APIs protegidas por usuário e senha.

Fluxo recomendado:

```text
Dashboard React
→ Backend interno Emex
→ Newave / URA
→ API interna
→ SZ Chat
```

Benefícios:

```text
segredos ficam fora do frontend
CORS é resolvido corretamente
logs ficam centralizados
permissões podem ser controladas
erros podem ser tratados de forma padrão
URLs sensíveis não ficam expostas no navegador
```

## Manutenção recomendada

Antes de alterar o painel, validar:

```text
qual indicador será afetado
qual API fornece o dado
qual fila entra no cálculo
qual período é considerado
qual componente renderiza o indicador
se o dado pode vir nulo
se o dado pode vir como string
se a API pode ficar indisponível
se o dashboard deve exibir zero, loading ou erro
se o build continua funcionando
se o monitor final tem resolução compatível
```

## Checklist antes de publicar no GitHub

- [ ] Repositório renomeado para `dash-atendimento-tempo-real`.
- [ ] `package.json` ajustado.
- [ ] `README.md` atualizado.
- [ ] `.env` removido do repositório.
- [ ] Credenciais expostas trocadas.
- [ ] `.env.example` criado.
- [ ] `.env` incluído no `.gitignore`.
- [ ] URLs sensíveis removidas do código.
- [ ] IPs fixos migrados para configuração.
- [ ] Dependências instaladas com `npm install`.
- [ ] Aplicação testada com `npm start`.
- [ ] Build validado com `npm run build`.
- [ ] Dashboard URA validado.
- [ ] API interna validada.
- [ ] Gauge de churn validado.
- [ ] Lista de agentes validada.
- [ ] Fila validada.
- [ ] Componente SZ revisado.
- [ ] Componente Fluctus revisado.
- [ ] CORS resolvido por arquitetura correta.
- [ ] Backend/proxy definido para produção.
- [ ] Responsável técnico definido.
- [ ] Responsável operacional definido.
