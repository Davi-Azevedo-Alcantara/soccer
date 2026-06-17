Para esse projeto, eu usaria **stack web-first**, não game engine.

Minha recomendação principal:

**Frontend**
React + TypeScript + Next.js + Tailwind CSS.

Next.js é bom porque já resolve rotas, layouts, otimizações e estrutura de app web grande; a própria documentação define ele como framework React para aplicações web completas. Tailwind combina bem com esse visual “jornal esportivo + dashboard moderno”, porque permite criar identidade visual rápido com classes utilitárias. ([Next.js][1])

**Para o protótipo visual agora**
Eu usaria:

```txt
Next.js
TypeScript
Tailwind CSS
Framer Motion
Lucide Icons
Recharts
Mock data local em JSON/TS
```

**Para mobile futuramente**
Duas opções:

A mais prática: fazer o web app responsivo/PWA primeiro. Roda no desktop e celular pelo navegador.

A mais robusta depois: React Native com Expo, porque o Expo permite criar apps para Android, iOS e web usando JavaScript/TypeScript, segundo a documentação oficial. ([Expo Documentation][2])

**Stack final que eu escolheria**

```txt
Frontend Web: Next.js + TypeScript + Tailwind
Mobile App futuro: Expo/React Native
Backend futuro: NestJS ou Fastify
Banco: PostgreSQL
Realtime: WebSocket
Cache/Fila: Redis
Storage: S3 compatível
Admin: dentro do próprio Next.js ou app separado
```

Para agora, visual mockado: **Next.js + TypeScript + Tailwind** é o melhor caminho. Simples, bonito, rápido e já prepara o projeto para crescer.

[1]: https://nextjs.org/docs?utm_source=chatgpt.com "Next.js Docs | Next.js"
[2]: https://docs.expo.dev/?utm_source=chatgpt.com "Expo Documentation"
