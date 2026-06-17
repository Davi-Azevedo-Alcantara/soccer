Você é um agente de desenvolvimento frontend sênior. Crie uma aplicação visual navegável, responsiva e completa para um jogo online de gerenciamento de futebol inspirado em Brasfoot/Football Manager social, mas com identidade própria. Neste momento, crie apenas o visual/frontend com dados mockados. Não implemente backend real, autenticação real, pagamentos reais, banco de dados real ou integrações externas.

Objetivo:
Criar uma aplicação web/mobile-first onde jogadores possam criar clubes fictícios, participar de ligas criadas por usuários, jogar campeonatos online em tempo real agendado, acompanhar partidas simuladas com campo 2D e eventos narrados, gerenciar elenco, táticas, treinos, estádio, torcida, mercado, base, cosméticos e administração do sistema.

Stack sugerida:
Use React, Next.js ou Vite com TypeScript. Use Tailwind CSS ou CSS moderno modular. A aplicação deve ser responsiva para navegador desktop e mobile. Use dados mockados em arquivos locais, por exemplo mockData.ts/json. Use estado local para interações simples.

Idioma:
Toda interface deve estar em português brasileiro.

Estilo visual:
Misture quatro referências:
1. Minimalismo funcional estilo Brasfoot.
2. Interface moderna estilo Football Manager.
3. Toque retrô esportivo.
4. Visual esportivo realista, com placar, painéis, tabelas, cards e campo 2D.

Não use nomes reais de clubes, jogadores, ligas, federações ou marcas. Todos os nomes devem ser fictícios. Evite qualquer referência direta a Neymar, Messi, Cristiano Ronaldo, Real Madrid, Barcelona, FIFA, UEFA, CONMEBOL etc.

Crie uma aplicação com layout principal contendo:
- Sidebar no desktop.
- Bottom navigation no mobile.
- Header com nome do clube, saldo, fãs, reputação e notificações.
- Tema escuro moderno com possibilidade visual de cards claros/contraste.
- Cards com estatísticas rápidas.
- Tabelas esportivas.
- Badges de status.
- Gráficos simples fake/mockados quando fizer sentido.
- Campo 2D simples para visualização da partida.

Páginas principais obrigatórias:

1. Dashboard do Clube
Mostrar:
- Nome do clube fictício.
- Escudo mockado.
- Uniforme principal.
- Saldo financeiro.
- Base de fãs.
- Reputação regional.
- Estádio atual.
- Próxima partida.
- Posição na liga.
- Últimos resultados.
- Alertas: jogador lesionado, treino pendente, proposta recebida, denúncia administrativa mockada.

2. Criar/Editar Clube
Tela visual para customização:
- Nome do clube.
- Sigla.
- Região fictícia.
- Cores primária/secundária.
- Escudo com editor visual simples mockado.
- Uniforme casa/fora com preview.
- Nome dos jogadores editável, mas com aviso de filtro contra nomes reais.
- Mascote/pet cosmético.
- Estádio visual.
Tudo pode ser mockado, mas a tela precisa parecer funcional.

3. Ligas
Tela com:
- Lista de ligas públicas e privadas criadas por usuários.
- Criar nova liga.
- Entrar em liga.
- Ligas com IA preenchendo vagas.
- Tags: pública, privada, em andamento, aguardando times, temporada infinita, temporada temporária, liga com objetivo.
- Mostrar quantidade de divisões: Série A, Série B, Série C.
- Mostrar vagas humanas e vagas IA.

4. Criar Liga
Formulário visual completo:
- Nome da liga.
- Pública ou privada.
- Número de times.
- Número de divisões.
- Permitir entrada no meio da temporada ou apenas ao fim.
- IA completa vagas vazias.
- Tipo de temporada:
  - Infinita.
  - Termina após X temporadas.
  - Termina quando alguém conquista objetivo.
- Objetivos possíveis:
  - Ganhar Série A.
  - Ganhar 3 títulos.
  - Ganhar liga + copa.
  - Tríplice coroa.
  - Subir da Série C até a Série A e vencer.
- Permitir copas paralelas.
- Permitir torneios regionais/internacionais fictícios.
- Regras de substituição, prorrogação e pênaltis.
- Tempo de partida.
- Tipo de partida: tempo real agendado ou modo rápido contra IA.

5. Detalhe da Liga
Mostrar:
- Tabela de classificação.
- Divisões A/B/C.
- Próximos jogos.
- Últimos resultados.
- Clubes humanos e clubes IA.
- Histórico da temporada.
- Artilharia.
- Assistências.
- Cartões.
- Lesões.
- Botão “Assumir time IA”, com indicação visual se a regra permitir.
- Aba de copas da liga.
- Aba de torneios regionais/internacionais.

6. Partida ao Vivo
Esta é uma das telas mais importantes.
Criar uma tela com:
- Placar no topo.
- Tempo de jogo correndo visualmente.
- Campo 2D simples com bolinhas/ícones dos jogadores.
- Eventos narrados em tempo real mockado.
- Exemplo de eventos:
  - “12’ — O meia abre o jogo pela direita.”
  - “18’ — Pressão alta força erro da defesa.”
  - “24’ — Passe infiltrado deixa o atacante em ótima posição.”
  - “39’ — Chuva começa a pesar no ritmo da partida.”
  - “45+2’ — Fim do primeiro tempo.”
- Estatísticas: posse, finalizações, passes certos, faltas, cartões, impedimentos, xG fictício.
- Painel de táticas ao lado ou abaixo.
- Botões para mudar mentalidade, ritmo, linha defensiva, pressão, tipo de ataque.
- A partida não pode ter botão de pausar.
- Mostrar aviso: “A partida roda no servidor e continua mesmo se o jogador sair.”
- Criar área de substituições ao vivo.
- Criar área para substituições programadas.

7. Programação de Táticas/Substituições
Tela ou modal para configurar regras automáticas:
- Se estiver perdendo aos 70’, mudar para ofensivo.
- Se jogador tiver stamina abaixo de 25%, substituir.
- Se receber cartão vermelho, mudar para linha baixa.
- Aos 60’, colocar jogador específico.
- Se estiver vencendo aos 80’, reduzir ritmo.
- Se empate em mata-mata, priorizar atacante.
Tudo mockado, mas visualmente configurável.

8. Elenco
Mostrar lista de jogadores fictícios:
- Nome.
- Idade.
- Posição.
- Overall.
- Moral.
- Stamina.
- Condição física.
- Valor.
- Salário.
- Contrato.
- Status: titular, reserva, lesionado, suspenso.
- Atributos universais:
  - Passe.
  - Drible.
  - Finalização.
  - Marcação.
  - Velocidade.
  - Fôlego.
  - Força.
  - Posicionamento.
  - Visão.
  - Controle de bola.
  - Cabeceio.
  - Reflexo para goleiros.
- Habilidades especiais:
  - Passe infiltrado.
  - Chute de longe.
  - Marcação forte.
  - Cabeceio ofensivo.
  - Cabeceio defensivo.
  - Especialista em faltas.
  - Decisivo.
  - Líder.
  - Contra-ataque rápido.
  - Armadilha de impedimento.
  - Cobertura defensiva.
- Traits simples, sem sistema RPG complexo.

9. Escalação e Tática
Tela com:
- Campo 2D tático.
- Formação: 4-4-2, 4-3-3, 3-5-2, 4-2-3-1 etc.
- Arrastar jogadores ou selecionar posição de forma mockada.
- Mentalidade:
  - Ultra defensivo.
  - Defensivo.
  - Equilibrado.
  - Ofensivo.
  - Pressão total.
- Construção:
  - Posse.
  - Contra-ataque.
  - Jogo pelas pontas.
  - Bola longa.
  - Cruzamentos.
  - Chute de longe.
- Defesa:
  - Linha baixa.
  - Linha média.
  - Linha alta.
  - Marcação por zona.
  - Marcação individual.
  - Pressão pós-perda.
  - Armadilha de impedimento.
- Ritmo:
  - Cadenciado.
  - Normal.
  - Intenso.
Mostrar impacto visual de cada escolha em barras de risco/recompensa.

10. Treinos
Tela com sistema misto:
- Automático.
- Manual simples.
- Foco semanal.
- Especialização individual.
- Recuperação física.
- Treino tático.
- Treino de finalização.
- Treino defensivo.
- Bola parada.
- Entrosamento.
- Base/jovens.
Mostrar efeitos positivos e negativos:
- Melhora atributo.
- Pode aumentar cansaço.
- Pode aumentar risco de lesão.
- Pode melhorar entrosamento.

11. Categorias de Base
Tela com:
- Jovens/promessas.
- Olheiros.
- Academia.
- Evolução de jovens.
- Promoção ao time principal.
- Investimento na base.
- Relatórios de potencial.
- Jogadores fictícios sub-17/sub-20.
- Possibilidade visual de venda futura de promessa.

12. Mercado de Transferências
Tela com:
- Comprar/vender jogadores.
- Negociações com clubes IA.
- Negociações com jogadores humanos.
- Propostas recebidas.
- Propostas enviadas.
- Contratos.
- Salários.
- Duração contratual.
- Renovação.
- Empréstimo e cláusulas podem aparecer como “em breve” ou mockadas.
- Filtros por posição, idade, valor, overall, habilidade especial e região.

13. Estádio e Clube
Tela de evolução do clube:
- Estádio.
- Capacidade.
- Gramado.
- Iluminação.
- Camarotes.
- Lojas.
- Museu/sala de troféus.
- Centro de treinamento.
- Departamento médico.
- Marketing.
- Rede de olheiros.
- Relação com torcida.
- Transporte/logística.
- Mostrar impacto em fãs, renda, reputação e desempenho.

14. Loja de Cosméticos
Monetização sem pay-to-win.
Mostrar:
- Uniformes.
- Escudos.
- Estádios visuais.
- Mascotes/pets.
- Animações de gol.
- Temas de interface.
- Placas de publicidade personalizadas.
- Banners de torcida.
- Itens apenas visuais.
Mostrar aviso: “Itens cosméticos não dão vantagem competitiva.”

15. Anúncios Integrados
Criar mock visual de anúncios discretos:
- Placas laterais no campo 2D.
- Banner leve no intervalo.
- Espaço discreto na tela de resultado.
- Nunca usar pop-up invasivo.
- Nunca cobrir informações importantes.
A ideia é parecer parte natural do futebol.

16. Calendário
Mostrar:
- Jogos agendados.
- Partidas em tempo real.
- Jogos rápidos contra IA.
- Treinos da semana.
- Fechamento de janela de transferências.
- Rodadas da liga.
- Copas.
- Torneios internacionais fictícios.
- Descanso entre jogos.

17. Clima e Condições da Partida
Tela ou card dentro da partida/calendário mostrando:
- Chuva.
- Neblina.
- Sol.
- Frio/calor.
- Gramado bom, pesado ou ruim.
- Impacto tático:
  - Chuva reduz passe curto.
  - Gramado ruim aumenta erro técnico.
  - Neblina reduz precisão.
  - Campo pesado aumenta cansaço.
Use dados mockados.

18. Painel Administrativo
Criar área separada de admin/backoffice, visualmente diferente, com acesso mockado.
Deve ter controle total do sistema, mas apenas visual/mockado.

Páginas do admin:
- Visão geral.
- Usuários.
- Times.
- Ligas.
- Partidas.
- Denúncias.
- Logs técnicos.
- Logs administrativos.
- Logs financeiros/custos.
- Economia do jogo.
- Moderação de nomes/escudos/uniformes.
- Punições.

O admin deve conseguir visualizar ações mockadas:
- Banir usuário.
- Suspender temporariamente.
- Restringir criação/edição de nome, escudo e uniforme.
- Restringir mercado/transferências.
- Ver reputação do usuário.
- Corrigir placar.
- Editar dinheiro.
- Editar estádio.
- Editar jogador.
- Adicionar/remover item cosmético.
- Resolver denúncia.
- Aplicar compensação.
- Ver histórico de ações.

Toda ação administrativa deve gerar log visual imutável mockado:
“Admin Kessler adicionou 50.000 moedas ao Clube Aurora por motivo: correção de bug da partida #1821.”

19. Logs
Criar visual para três tipos:
- Logs técnicos: erros captados em try/catch, falhas de API, falhas de login, timeout, pagamento, simulação.
- Logs de moderação/informação: denúncias, punições, alterações administrativas.
- Logs financeiros/operacionais: custo diário, semanal, mensal e anual.
Mostrar cards:
- Custo de servidor.
- Banco de dados.
- Storage.
- IA.
- CDN.
- Email.
- Gateway de pagamento.
- Receita com cosméticos.
- Receita com ads.
- Lucro/prejuízo estimado.

20. Denúncias
Tela com:
- Denúncias abertas.
- Tipo: nome ofensivo, tentativa de usar nome real, escudo impróprio, comportamento abusivo, suspeita de exploração/partida roubada.
- Status: aberta, analisando, resolvida, recusada.
- Ação tomada.
- Histórico do usuário.
- Botão visual para punir, arquivar ou solicitar revisão.

Dados mockados:
Crie dados suficientes para parecer produto real:
- 8 a 12 clubes fictícios.
- 30 a 60 jogadores fictícios.
- 3 ligas fictícias.
- 2 copas fictícias.
- 1 torneio internacional fictício.
- 10 partidas passadas.
- 5 partidas futuras.
- 1 partida ao vivo.
- 10 eventos narrados de partida.
- 5 denúncias.
- 10 logs técnicos.
- 10 logs administrativos.
- 10 registros financeiros.
- 10 cosméticos.

Regras importantes:
- Não usar nomes reais de jogadores, clubes, federações ou marcas.
- Não criar integração real com pagamento.
- Não criar login real.
- Não criar backend.
- Não usar API externa.
- Tudo deve ser mockado/local.
- A interface deve parecer funcional e navegável.
- O foco é protótipo visual forte, bonito e completo.
- Priorize UX clara.
- Use componentes reutilizáveis.
- Deixe o código organizado.

Rotas sugeridas:
/
/dashboard
/clube
/clube/customizacao
/ligas
/ligas/criar
/ligas/:id
/partida/ao-vivo
/taticas
/elenco
/treinos
/base
/mercado
/estadio
/loja
/calendario
/admin
/admin/usuarios
/admin/times
/admin/ligas
/admin/partidas
/admin/denuncias
/admin/logs
/admin/custos
/admin/economia

Critérios de aceitação:
- A aplicação abre sem erros.
- Todas as telas principais são navegáveis.
- Mobile e desktop funcionam visualmente.
- O campo 2D aparece na partida.
- A partida ao vivo tem placar, eventos narrados, estatísticas e táticas.
- O dashboard parece de um jogo real.
- A tela de ligas permite entender divisões, IA e entrada de jogadores.
- O painel administrativo parece uma ferramenta interna real.
- A loja deixa claro que cosméticos não dão vantagem.
- Os dados são todos fictícios.
- O visual transmite um jogo online de gerenciamento de futebol moderno, social e expansível.

Entregue:
1. Código completo do frontend.
2. Estrutura de pastas organizada.
3. Dados mockados separados.
4. Componentes reutilizáveis.
5. Interface responsiva.
6. Breve README explicando como rodar.