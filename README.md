# 🩺 Dashboard Epidemiológico & Triagem Preditiva de Dengue

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI v6](https://img.shields.io/badge/MUI_v6-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Google BigQuery](https://img.shields.io/badge/Google_BigQuery-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/bigquery)
[![XGBoost / ONNX](https://img.shields.io/badge/ML-XGBoost_%2F_ONNX-FF6F00?style=for-the-badge&logo=xgboost&logoColor=white)](https://onnxruntime.ai/)

Plataforma profissional de inteligência em saúde e apoio à decisão clínica. O sistema transiciona a análise de dados epidemiológicos da dengue de um escopo puramente municipal para uma **visão analítica multiescala (Municipal, Estadual e Nacional)** em tempo real, integrando a base pública oficial do **SINAN (MS)** via **Google BigQuery** a um motor de inferência preditiva com **XGBoost/ONNX**.

---

## 🚀 Funcionalidades Principais

### 📊 1. Painel Epidemiológico Multiescala
* **Alternância Geográfica Dinâmica:** Visualização instantânea de métricas em nível de **Município** (ex: Barbosa - SP), **Estado** (São Paulo) e **País** (Brasil) sem recarregar a página.
* **Métricas Normalizadas (%):** Comparativos percentuais de prevalência de sintomas e gravidade por faixa etária, garantindo análises não distorcidas pela disparidade populacional.
* **Gráficos Avançados (Recharts):**
  * *Taxa Geral de Gravidade (%):* Comparativo horizontal entre escopos.
  * *Gravidade por Faixa Etária (%):* Análise de proporção de quadros graves por grupo etário.
  * *Prevalência de Sintomas (%):* Frequência acumulada de sintomas notificados.

### ⚕️ 2. Formulário de Triagem Preditiva Clinicamente Estruturado
* **Predição em Tempo Real:** Motor de Machine Learning (XGBoost exportado em ONNX) para estimativa de probabilidade de agravamento de casos de dengue.
* **UX/UI Otimizada:**
  * **Dados Demográficos:** Sempre visíveis para rápido preenchimento (Idade, Sexo, Gestante, Raça/Cor).
  * **Comorbidades e Sintomas Iniciais:** Agrupados em *Accordions* retráteis para manter a interface limpa e focada.
  * **Sinais de Alarme & Complicações Graves:** Seção destacada em tom de alerta visual para rápida identificação de risco crítico.
* **Painel de Avaliação Diagnóstica:** Feedback visual instantâneo com classificação de risco, porcentagem de probabilidade, corte utilizado e fatores de risco ativos detectados.

---

## 🛠️ Arquitetura e Tech Stack

### **Frontend & Interface**
* **Next.js 14+ (App Router):** Componentes no servidor (RSC) para *data fetching* paralelo de alta performance e suporte a renderização dinâmica.
* **Material UI (MUI v6) + Custom Theme (\`hospitalTheme\`):** Design System customizado para o contexto hospitalar em modo escuro (*Dark Mode* - Slate/Sky palette), utilizando \`@mui/material-nextjs\` com \`AppRouterCacheProvider\` para eliminação de *hydration mismatch* e FOUC.
* **Recharts:** Visualização gráfica reativa e totalmente tipada em TypeScript.

### **Backend & Data Pipeline**
* **Google BigQuery (\`br_ms_sinan.microdados_dengue\`):** Consultas otimizadas com agregações server-side (\`COUNTIF\`, \`WITH\` clauses) encapsuladas na classe **\`QueryRepository\`**, permitindo o carregamento simultâneo do comparativo nacional.
* **Model Inference:** API Route no Next.js alimentando o modelo ONNX Runtime com pré-processamento de *features* e threshold dinâmico de risco.


---

## 📦 Configuração e Instalação

### 1. Pré-requisitos
* **Node.js:** \`v18.x\` ou superior
* **npm** ou **yarn**
* **Google Cloud SDK:** Conta GCP configurada com acesso ao dataset público do SINAN no BigQuery.

### 2. Instalação de Dependências
\`\`\`bash
npm install
\`\`\`

### 3. Variáveis de Ambiente
Crie um arquivo \`.env.local\` na raiz do projeto com as credenciais do GCP e diretórios dos modelos:

\`\`\`env
GOOGLE_PROJECT_ID=seu-projeto-gcp
GOOGLE_CLIENT_EMAIL=seu-email-service-account@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nSuaChavePrivadaHere\\n-----END PRIVATE KEY-----\\n"
MODEL_ONNX_PATH="./model/xgboost_dengue.onnx"
\`\`\`

### 4. Executando o Ambiente de Desenvolvimento
\`\`\`bash
npm run dev
\`\`\`
Acesse \`http://localhost:3000\` no seu navegador.

---

## ⚙️ CI/CD & Repositório Git

Para trabalhar com o repositório utilizando autenticação segura via **SSH**:

\`\`\`bash
# Alterar remoto para SSH
git remote set-url origin git@github.com:time-mate-org/pi4.git

# Enviar atualizações
git add .
git commit -m "feat: suporte multiescala e melhorias de UX no formulário de triagem"
git push -u origin main
\`\`\`

---

## 🔒 Licença e Créditos
Desenvolvido para o **Hospital Municipal de Barbosa - SP**.
Dados epidemiológicos provenientes do **SINAN / Ministério da Saúde do Brasil**.