[README.md](https://github.com/user-attachments/files/33884956/README.md)
# Economia mundial e G20

Dashboard interativo com 195 economias e 24 indicadores do FMI, de 1980 a 2031: mapa-múndi, comparação entre continentes, histórico por país, correlações entre indicadores, detalhes do G20 e uma corrida de barras animada.

É um site estático: abre direto no navegador, sem login e sem servidor. Os filtros ficam no endereço da página, então um link pode abrir uma visão específica, por exemplo `?indicador=pib_usd&visao=barras` para a corrida do PIB em dólares.

## Publicar no GitHub Pages

1. No GitHub, crie um repositório público chamado `economia-mundial` (botão **New**). Não precisa marcar nenhuma opção.
2. Na página do repositório vazio, clique em **uploading an existing file**.
3. Arraste para a janela **o conteúdo** desta pasta: `index.html`, `dash-local.js`, `d3.min.js`, `capa.png`, `README.md`, `.nojekyll` e a pasta `dados`. Clique em **Commit changes**.
4. Vá em **Settings → Pages**. Em **Branch**, escolha `main` e a pasta `/ (root)` e clique em **Save**.
5. Em um ou dois minutos o site fica no ar em `https://SEU-USUARIO.github.io/economia-mundial/`.

Opcional, para a prévia do link no LinkedIn mostrar a imagem de capa: edite o `index.html` no GitHub (ícone de lápis) e troque `SEU-USUARIO` pelo seu nome de usuário na linha `og:image`.

## Arquivos

- `index.html`: a página do dashboard.
- `dash-local.js`: carrega os dados da pasta `dados`, faz os cálculos (medianas por continente, posições, médias por década e outros) e guarda os filtros na URL.
- `d3.min.js`: biblioteca D3 7.9.0 (licença ISC).
- `dados/`: os dados em JSON.
  - `historico_fmi.json`: painel país-ano de 1980 a 2031 com 24 indicadores.
  - `agregados_fmi.json`: agregados oficiais do FMI (Mundo, economias avançadas, G7 e outros).
  - `paises.json`: nome, continente, sub-região e participação no G20 de cada economia.
  - `contornos_paises.json`: fronteiras simplificadas para o mapa.
  - `indicadores_g20.json` e `projecoes_fmi_out2026.json`: últimos dados e projeções do G20.

## Fontes

- FMI, pela API do DataMapper, baixado em 23/10/2026: World Economic Outlook de outubro de 2026, Fiscal Monitor, Global Debt Database e Public Finances in Modern History. A partir de 2026 os números são projeções.
- Trading Economics: últimos dados divulgados por país na aba G20 (consultados em 22 e 23/10/2026).
- Natural Earth (domínio público): contornos dos países.
- Pacote world-countries (licença ODbL): continentes e sub-regiões, com o Oriente Médio e o Cáucaso dentro da Ásia.

Medianas e médias por continente são calculadas a partir dos países e não são números oficiais do FMI.

Feito com o Claude.
