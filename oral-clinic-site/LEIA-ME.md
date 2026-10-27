# Site Oral Clinic — versão para GitHub + Vercel

Esta pasta é um site estático (HTML, CSS e JavaScript). **Não usa PHP**, porque a Vercel não executa PHP.
Os pedidos de agendamento vão para uma **planilha do Google** da clínica.

## 1. Planilha de agendamentos (cada clínica tem a sua)

1. Entre no Google com a conta da clínica e crie uma **Planilha** nova (planilha em branco). Nome sugerido: "Agendamentos Oral Clinic".
2. Menu **Extensões > Apps Script**.
3. Apague o que estiver lá, cole todo o conteúdo do arquivo `apps-script/Codigo.gs` e ajuste o topo (nome da clínica e, se quiser aviso por e-mail, `EMAIL_AVISO`). Clique em **Salvar**.
4. Clique em **Implantar > Nova implantação**. Em "Selecionar tipo", escolha **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Clique em **Implantar** e autorize quando o Google pedir (aparece um aviso "app não verificado": clique em *Avançado* e depois em *Acessar*; é o seu próprio script).
6. Copie o **URL do app da Web** (termina em `/exec`).
7. No projeto, abra `assets/js/config.js` e cole o endereço em `formUrl: "..."`.

Pronto: cada pedido vira uma linha na planilha (nome, telefone, serviço, data, período). A coluna **WhatsApp** tem um link que abre a conversa com o paciente já com a mensagem pronta. A coluna **Status** tem lista (Novo, Confirmado, Cancelado). A dona da clínica só precisa abrir a planilha, pelo celular ou computador.

Se mudar o código do script depois, use **Implantar > Gerenciar implantações > Editar > Nova versão**, senão o endereço continua com o código antigo.

## 2. Preencher os dados da clínica

Abra `assets/js/config.js` e preencha WhatsApp, Instagram, e-mail, responsável técnico e CRO. Telefone, endereço e horários já estão preenchidos.

## 3. VS Code, GitHub e Vercel

**Instalar (uma vez):** [VS Code](https://code.visualstudio.com), [Git](https://git-scm.com/downloads) e criar contas gratuitas no [GitHub](https://github.com) e na [Vercel](https://vercel.com). Entre na Vercel usando "Continue with GitHub".

**VS Code:**
1. Extraia esta pasta no seu computador.
2. Abra o VS Code > **Arquivo > Abrir Pasta** e escolha a pasta do site.
3. Abra o terminal do VS Code (**Terminal > Novo Terminal**) e rode, uma linha por vez:

```
git init
git add .
git commit -m "Primeira versão do site"
git branch -M main
```

**GitHub:**
1. No GitHub, clique em **New repository**. Nome: `oral-clinic-site`. Deixe **Private** e **não** marque "Add a README".
2. Na página que aparecer, copie as duas linhas do bloco "push an existing repository" e rode no terminal do VS Code. Elas são parecidas com:

```
git remote add origin https://github.com/SEU-USUARIO/oral-clinic-site.git
git push -u origin main
```

**Vercel:**
1. Na Vercel: **Add New > Project** e escolha o repositório `oral-clinic-site`.
2. Em **Framework Preset**, deixe **Other**. Não precisa de Build Command nem de Output Directory.
3. Clique em **Deploy**. Em um minuto o site abre num endereço `.vercel.app`.

**Domínio e subdomínio:** no projeto, **Settings > Domains > Add**, digite o subdomínio (por exemplo `oralclinic.seudominio.com.br`) e crie no seu provedor de domínio o registro DNS que a Vercel mostrar (normalmente um CNAME).

**Atualizar o site:** edite os arquivos no VS Code, e rode `git add .`, `git commit -m "o que mudou"` e `git push`. A Vercel publica sozinha.

## Vários clientes

Crie **um repositório e um projeto na Vercel por cliente** (copie esta pasta, troque logo, fotos, textos e `config.js`) e dê a cada um o seu subdomínio. Cada cliente tem a sua própria planilha, então os pedidos nunca se misturam.

**Atenção ao plano da Vercel:** o plano gratuito (Hobby) só permite uso pessoal e não comercial. Sites feitos para clientes pagantes exigem o plano Pro, segundo a política da própria Vercel.

## Pendências antes de divulgar

- Trocar as fotos de IA por fotos reais.
- Preencher responsável técnico e CRO (exigência do CFO).
- Revisar `privacidade.html` com um advogado.
- Trocar `SEU-DOMINIO.com.br` no `sitemap.xml`.
- Testar um pedido de ponta a ponta: preencher o formulário no site publicado e conferir a linha na planilha.
