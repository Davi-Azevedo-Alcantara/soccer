# Soccer Architect MVP

Protótipo técnico em Next.js, React, TypeScript e Tailwind CSS para um simulador de futebol focado em identidade tática por estilos de jogadores.

## Loop jogável

1. Crie ou renomeie o clube.
2. Escolha a estratégia.
3. Monte o XI inicial.
4. Procure sinergias entre estilos de jogo.
5. Simule partidas da temporada.
6. Personalize identidade, estádio e patrocínios.
7. Use mercado e base para reforçar a identidade do time.

## Diferencial do protótipo

Cada jogador possui atributos, potencial e um ou mais estilos. Quando o XI inicial possui estilos suficientes, o time ativa buffs coletivos.

Exemplo: três jogadores com `Condução precisa` ativam `Controle de posse`, melhorando o plano de posse paciente.

## Gestão tática

A tela `Tática` permite escolher estratégia e esquema, além de escalar jogador por jogador em cada posição do campo.

- formações disponíveis: 4-3-3, 4-2-3-1, 3-5-2, 4-4-2 e 5-3-2;
- cada esquema possui ponto forte e ponto fraco;
- jogadores fora de posição reduzem o encaixe;
- muitos atacantes, pontas e meias aumentam ofensividade;
- volantes, laterais, zagueiros e goleiro aumentam defesa;
- meio-campistas e jogadores técnicos aumentam controle.

## Interface

O MVP usa um menu lateral fixo e um menu superior contextual dentro de cada seção. Os jogadores aparecem em cards com ícone de camisa, número editável, posição, atributos, potencial e estilos.

## Gestão do clube

O MVP também possui uma aba `Clube` para criar pertencimento:

- escudo textual, cores e lema;
- nome do estádio, capacidade, atmosfera, instalações e preço de ingresso;
- propostas de patrocinadores com entrada, pagamento por jogo e bônus por vitória;
- torcida e valor do clube como indicadores de crescimento.

## História, jornal e rede social

A aba `História` guarda a memória viva do clube:

- rivalidade local e torcida organizada;
- recordes como maior vitória, artilheiro histórico e sequência invicta;
- ídolos gerados por jogos, gols e legado de atletas da base;
- reputação por estilo de jogo;
- jornal da liga com manchetes sobre partidas, base, mercado, estádio e patrocinadores;
- feed social com reação da torcida e perfis do universo do jogo.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.
