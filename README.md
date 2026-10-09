# VORA — Academia boutique

Site estático de uma marca fictícia de academia, desenvolvido com HTML, CSS e JavaScript.

## Arquivos

- `index.html`: página inicial, planos e unidades.
- `espacos.html`, `equipamentos.html`, `historia.html`, `equipe.html`, `produtos.html`, `contato.html`: páginas internas.
- `styles.css`, `app.js`, `scroll.js`: visual, conteúdo e interações.
- `language.js`, `translations.js`: seletor de idiomas e traduções completas em português, inglês e espanhol.
- `pictures/`: imagens utilizadas no site.
- `image-review/catalog.json` e `content/site-content.json`: catálogo e conteúdo.

## Prévia local

Com Python instalado, execute `python preview-server.py` nesta pasta e abra http://127.0.0.1:4186/.

## Publicação no Vercel

Importe o repositório GitHub. Use Framework Preset `Other`, Root Directory `./`, Build Command vazio e Output Directory `.`. Não são necessárias variáveis de ambiente nem instalação de dependências. A configuração está em `vercel.json`.

## Contato

Os canais sociais aguardam URLs definitivas. O e-mail `contato@vora.example` é demonstrativo.

## Idiomas

O seletor no cabeçalho oferece português, inglês e espanhol. As traduções estão em translations.js e o comportamento em language.js. Os dois arquivos devem ser enviados junto com o restante do site. A preferência é salva no navegador e preservada nos links entre páginas.


## Enviar esta versão ao GitHub

Envie o conteúdo desta pasta mantendo as subpastas. O arquivo `index.html` deve estar na raiz do repositório, ao lado de `vercel.json`.

Inclua todos os HTML, CSS e JavaScript, a pasta `pictures`, a pasta `content` e `image-review/catalog.json`. O `.gitignore` já exclui os materiais de revisão que não são usados pelo site. Não envie apenas os arquivos HTML: as imagens, os dados e os scripts são necessários.

Se o repositório já estiver configurado, execute nesta pasta:

```powershell
git add .
git commit -m "Atualiza VORA com seletor de idiomas"
git push
```

Se ainda não houver repositório local, siga a configuração inicial antes desses comandos.
