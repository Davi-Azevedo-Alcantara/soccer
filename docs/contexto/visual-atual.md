# Direcao visual do Soccer Architect MVP

Voce e um diretor de arte senior, product designer e frontend developer trabalhando no `Soccer Architect MVP`, um prototipo em Next.js, React, TypeScript e Tailwind CSS para simulacao e gestao de um clube ficticio.

O produto atual tem um menu lateral, secoes internas, cards escuros e uma linguagem visual muito proxima de dashboard SaaS. A adaptacao visual deve transformar essa interface em um produto autoral, esportivo, editorial e memoravel, sem trocar o foco do jogo.

## Objetivo

Refatorar a UI existente para parecer um almanaque esportivo interativo: uma mistura de jornal de futebol, album de figurinhas, prancheta de treinador, boletim de campeonato, classificados esportivos e arquivo historico do clube.

A aplicacao deve continuar sendo jogavel e clara. O usuario precisa conseguir:

- renomear o clube;
- escolher estrategia e formacao;
- montar o XI inicial;
- simular partidas;
- acompanhar tabela, calendario, noticias e rede social;
- gerenciar elenco, mercado, base, estadio, patrocinadores e identidade do clube.

Nao implemente backend. Nao use dados reais. Nao use clubes, atletas, marcas, federacoes ou escudos reais. Preserve os dados mockados e a simulacao existente.

## Principio central

Se qualquer tela ainda parecer um painel administrativo comum com cards padronizados, a direcao visual falhou.

A mudanca precisa ser estrutural:

- layout;
- hierarquia;
- formas;
- tipografia;
- espacamento;
- componentes;
- microinteracoes;
- linguagem visual;
- composicao responsiva.

Nao basta mudar cor, borda, sombra ou background.

## Imaginario visual

A aplicacao deve combinar:

- capa de jornal esportivo antigo;
- almanaque anual de futebol;
- album de figurinhas;
- mesa de treinador com prancheta;
- boletim de campeonato;
- cartazes de estadio;
- classificados de jornal;
- fichario do clube;
- radio esportivo;
- placar retro;
- arquivo historico de uma agremiacao ficticia.

Evite:

- dashboard SaaS;
- sidebar corporativa comum;
- cards identicos em grade;
- glassmorphism;
- visual financeiro com tema de futebol;
- layout limpo demais;
- bege usado como fundo vazio;
- decoracao vintage superficial;
- excesso de retangulos arredondados iguais.

## Produto atual e escopo real

As telas existentes sao:

- `dashboard`: resumo, eventos e proximo jogo;
- `club`: identidade, estadio e patrocinadores;
- `history`: memoria, jornal e rede social;
- `squad`: elenco, numeracao e contratos;
- `tactics`: formacao, perfil e sinergias;
- `calendar`: jogos e resultados;
- `table`: classificacao e criterios;
- `transfers`: mercado e alvos;
- `academy`: promessas e desenvolvimento.

Nao crie telas novas obrigatorias como loja, admin, ligas multiplas ou partida ao vivo separada. Se surgir algum bloco inspirado nelas, ele deve servir ao MVP atual.

## Shell da aplicacao

O shell atual de header + menu lateral + menu contextual deve ser redesenhado como um objeto editorial.

Direcao:

- o topo deve parecer a faixa de cabecalho de um jornal esportivo;
- o nome `Soccer Architect` pode aparecer como nome do caderno ou gazeta;
- o campo de nome do clube deve parecer uma etiqueta editavel, uma ficha de inscricao ou um carimbo preenchido;
- o botao `Nova carreira` deve parecer um carimbo, alavanca de impressora ou botao de maquina;
- a navegacao principal deve parecer indice de almanaque, abas de fichario ou recortes colados;
- o menu contextual deve parecer abas de paginas, etiquetas de arquivo ou marcadores impressos.

Mesmo que a navegacao continue no lado esquerdo em desktop, ela nao deve parecer sidebar SaaS. Em mobile, pode virar faixa horizontal de recortes ou abas.

## Linguagem tipografica

Use pelo menos 3 estilos tipograficos:

1. Manchetes: serifada forte, slab ou display vintage.
2. Placar e numeros: condensada esportiva.
3. Texto comum: sans-serif moderna e legivel.

Sugestoes:

- manchetes: `Roboto Slab`, `Bitter`, `Playfair Display`, `Archivo Black` ou similar;
- placar/numeros: `Oswald`, `Bebas Neue` ou similar;
- texto comum: `Inter`, `Manrope` ou similar.

Regras:

- titulos de capa devem ser grandes e dramaticos;
- numeros de classificacao, overall, orcamento, placar e atributos devem ter peso visual;
- textos de suporte precisam continuar legiveis;
- nao use texto gigante dentro de paineis compactos;
- nao deixe labels quebrarem ou estourarem no mobile.

## Paleta

Use paleta vintage forte, com contraste real.

Base:

- Papel envelhecido: `#F1E2B8`
- Papel claro: `#FFF3CF`
- Papel escuro: `#D2B77A`
- Tinta preta: `#181713`
- Vermelho manchete: `#B32018`
- Verde campo: `#246B3A`
- Verde profundo: `#153D25`
- Azul marinho antigo: `#162B45`
- Amarelo trofeu: `#D79A21`
- Marrom couro: `#6B3F24`
- Cinza jornal: `#5E5A4E`

Use o bege como papel, nao como vazio. Use vermelho para manchetes, alertas e carimbos. Use preto/carvao para contraste. Use verde nos elementos de campo, tatico e identidade esportiva. Evite um tema monotematico dominado por uma unica familia de cor.

## Texturas e formas

Use:

- sombras de papel;
- textura discreta de impressao;
- linhas de jornal;
- halftone leve;
- bordas levemente irregulares;
- divisorias grossas;
- recortes sobrepostos;
- fitas adesivas;
- etiquetas;
- selos circulares;
- carimbos diagonais;
- tiras de manchete;
- posters;
- fichas;
- envelopes;
- pranchetas.

Nao use apenas cards arredondados iguais. Componentes podem ter pequenas rotacoes, alturas diferentes e sobreposicoes leves, desde que a leitura e a responsividade continuem boas.

## Dashboard: capa do jornal do clube

O dashboard deve parecer a capa de um jornal esportivo da semana do clube.

Resumo:

- manchete principal com o nome do clube e a situacao da temporada;
- submanchete sobre estilo tatico, XI e identidade;
- mini campo como foto/diagrama de capa, nao como card generico;
- posicao, proximo jogo, forca do XI e orcamento como selos, carimbos ou chamadas laterais;
- buffs ativos como notas de redacao ou carimbos de estilo;
- eventos recentes como tiras de jornal;
- proximo jogo como poster de confronto.

Linguagem de exemplo:

- `AURORA FC BUSCA IDENTIDADE ANTES DO PLACAR`
- `Pressao alta ganha moral no vestiario`
- `Diretoria calcula receita antes da rodada`
- `XI titular tenta provar encaixe no gramado`

Evite grade comum de metric cards.

## Clube: ficha institucional e sala da diretoria

A tela `Clube` deve parecer um pacote fisico de documentos do clube.

Identidade:

- escudo textual como brasao impresso;
- cores como amostras de tecido/tinta;
- lema como frase em faixa ou flamula;
- campos de edicao com cara de ficha preenchida.

Estadio:

- deve parecer projeto de reforma e folheto de arquibancada;
- capacidade, atmosfera e instalacoes como medidores impressos;
- preco do ingresso como etiqueta de bilheteria;
- acoes de melhoria como placas de obra ou carimbos de aprovacao.

Patrocinios:

- propostas como contratos, envelopes ou anuncios de jornal;
- patrocinador assinado como selo `Ativo`;
- requisitos de torcida como clausulas destacadas.

## Historia: arquivo do clube, jornal e rede social

A tela `Historia` e o lugar da memoria do clube.

Memoria:

- deve parecer arquivo historico, vitrine de trofeus e fichas de idolos;
- rivalidade, torcida, recordes e reputacao por estilo devem virar dossies impressos;
- trofeus podem aparecer como etiquetas ou placas em uma parede de arquivo.

Jornal:

- noticias devem parecer recortes de jornal;
- cada noticia deve ter fonte, semana, titulo forte e corpo curto;
- tons positivos, neutros e negativos podem variar selo, borda e cor de manchete.

Rede social:

- nao deve parecer feed corporativo;
- trate posts como bilhetes de torcida, recados de radio ou telegramas de arquibancada;
- sentimento pode aparecer como seta, carimbo ou etiqueta.

## Elenco: album de figurinhas e fichario

Jogadores nao devem parecer linhas de tabela nem cards SaaS.

Cada jogador deve parecer figurinha:

- silhueta/camisa;
- numero grande;
- nome;
- posicao;
- idade;
- overall/rating em destaque;
- potencial;
- valor;
- estilos como selos de habilidade;
- atributos em faixa ou quadrinhos de album;
- status `XI` como carimbo.

Interacao:

- hover levanta a figurinha com sombra de papel;
- botao de escalar/remover deve parecer etiqueta acionavel;
- vender deve parecer carimbo de transferencia;
- o controle de numero da camisa deve parecer campo de ficha.

A secao `Contratos` pode ser um resumo contabil de fichario, mas ainda com cara de clube, nao de financeiro SaaS.

## Tatica: prancheta do treinador

A tela `Tatica` deve parecer uma prancheta sobre a mesa.

Estrutura:

- campo central como papel tatico ou gramado impresso;
- jogadores como pecas numeradas;
- encaixe por posicao como pequenas etiquetas;
- seletor de estrategia e esquema como controles de prancheta;
- perfil coletivo como relatorio do auxiliar;
- sinergias como notas rabiscadas e carimbos de estilo.

Estrategias atuais:

- `Posse paciente`;
- `Pressao alta`;
- `Jogo vertical`;
- `Equilibrio`.

Nao invente novas regras de simulacao. Se renomear visualmente, mantenha o significado e os valores existentes.

O modal de troca de jogador deve parecer uma ficha aberta da prancheta, nao uma janela generica.

## Calendario: tabela de jogos e boletim de rodada

A tela `Calendario` deve parecer agenda de temporada e boletim de rodada.

Jogos futuros:

- como bilhetes de confronto;
- semana em destaque;
- mandante e visitante em formato de placar pre-jogo.

Resultados:

- como tiras de jornal ou etiquetas de resultado;
- placar com tipografia condensada;
- partidas ja jogadas com textura de carimbo `encerrado`.

## Tabela: classificacao impressa

A tela `Tabela` deve parecer tabela de liga publicada no jornal.

Direcao:

- linhas densas, legiveis e com divisorias fortes;
- posicao em destaque;
- clube do usuario marcado com faixa, selo ou fundo de recorte;
- pontos e saldo com tipografia de placar;
- criterios como rodape editorial ou caixa de regulamento.

Evite tabela moderna sem personalidade.

## Transferencias: classificados esportivos

A tela `Transferencias` deve parecer classificados de jornal e mesa de negociacao.

Mercado:

- jogadores como anuncios de classificados;
- valor como selo grande;
- estilos como palavras-chave do anuncio;
- botao comprar como etiqueta `Apresentar proposta`.

Alvos:

- destaque para filtros, oportunidades e observacoes como papeis presos;
- sem marketplace generico.

Vendas do elenco devem manter a metafora de carimbo/envelope de transferencia.

## Base: relatorio de olheiros

A tela `Base` deve parecer relatorio de observacao de jovens.

Promessas:

- jovens como fichas de olheiro;
- potencial como carimbo grande;
- idade e posicao como campos de formulario;
- botao promover como selo de chamada ao profissional.

Desenvolvimento:

- explique crescimento como notas de acompanhamento;
- use barras, carimbos e marcadores, nao graficos corporativos.

## Componentes reutilizaveis sugeridos

Crie componentes com nomes alinhados ao dominio visual, por exemplo:

- `EditorialShell`
- `NewspaperMasthead`
- `PaperSectionTabs`
- `NewspaperHeadline`
- `TornPaperCard`
- `StampBadge`
- `FixturePoster`
- `PlayerStickerCard`
- `TacticalClipboard`
- `PaperPitch`
- `RadioTicker`
- `ScoreboardNumber`
- `ClassifiedTransferCard`
- `ScoutReportCard`
- `SponsorEnvelope`
- `StadiumBlueprintCard`
- `PaperTable`
- `NewsStrip`
- `SupporterNote`

Nao e necessario criar todos de uma vez, mas a refatoracao deve caminhar nessa direcao e substituir os componentes genericos atuais (`Metric`, `InfoCard`, `ViewShell`) por equivalentes editoriais.

## Microinteracoes

Use microinteracoes discretas e tematicas:

- figurinha levanta no hover;
- carimbo aparece com leve impacto;
- poster de confronto ganha sombra de papel;
- evento novo entra como tira de noticia;
- placar ou numero importante pulsa levemente apos simulacao;
- botao pressionado parece carimbo ou maquina;
- abas parecem marcadores fisicos sendo selecionados.

Evite animacoes longas, distrativas ou que prejudiquem leitura.

## Responsividade

A experiencia precisa funcionar bem em mobile e desktop.

Desktop:

- composicoes editoriais assimetricas;
- sobreposicoes leves;
- areas com largura variada;
- campo/prancheta em destaque.

Mobile:

- recortes empilhados;
- navegacao horizontal por abas;
- manchetes ainda fortes, mas sem estourar;
- tabelas com scroll ou condensacao cuidadosa;
- botoes com area de toque confortavel.

Textos nao podem sobrepor outros elementos nem sair dos seus containers.

## Criterios de aceitacao

- O dashboard parece capa de jornal esportivo, nao dashboard.
- Clube parece ficha institucional, estadio/projeto e contratos, nao formularios genericos.
- Historia parece arquivo/jornal/torcida, nao feed comum.
- Elenco parece album de figurinhas, nao tabela de jogadores.
- Tatica parece prancheta do tecnico, nao formulario.
- Calendario parece boletim de rodada.
- Tabela parece classificacao impressa.
- Transferencias parecem classificados esportivos.
- Base parece relatorio de olheiros.
- A navegacao perdeu a aparencia de SaaS corporativo.
- A aplicacao continua responsiva, utilizavel e jogavel.
- Todas as funcionalidades mockadas existentes continuam preservadas.

## Tarefa

Refatore a UI existente com essa nova direcao visual.

Preserve a simulacao e os dados mockados. Nao implemente backend. Nao busque dados reais. Use apenas nomes ficticios. A entrega esperada e uma interface completamente redesenhada com identidade forte de almanaque/jornal esportivo vintage interativo.
