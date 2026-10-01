# TreinAI

Aplicação pessoal mobile-first para registrar treinos, séries, descansos e evolução em um ciclo configurável. Os dados ficam no dispositivo: não há conta, servidor ou banco remoto.

## Stack

React, TypeScript, Vite, React Router, Lucide React, SQLite WASM (`sql.js`), IndexedDB e PWA.

## Executar

```bash
npm install
npm run dev
```

Para gerar e visualizar a versão de produção:

```bash
npm run build
npm run preview
```

## Dados locais

O SQLite é inicializado no primeiro acesso e salvo como arquivo binário no IndexedDB após cada alteração. O schema, a migração idempotente e os dados iniciais estão em `src/db.ts`. O seed cadastra cinco treinos de segunda a sexta, com oito exercícios em cada. Ao atualizar uma instalação antiga, as sessões anteriores são associadas aos novos IDs dos treinos; exercícios antigos com séries registradas ficam preservados sem vínculo com a rotina atual para manter o histórico.

Os exercícios ainda sem GIF usam `/exercises/placeholder.svg`. Os IDs usam slugs, como `supino-maquina` e `crucifixo`; os GIFs existentes ficam em `public/exercises/`, e seus caminhos são definidos em `gifByExercise` no `src/db.ts`. Para editar nomes, ordem, séries, repetições, equipamento ou descanso, atualize os dados em `src/db.ts`.

A meta inicial está configurada em 45 treinos. Ela pode ser alterada em Configurações e é persistida no próprio banco. Nome exibido também é configurável.

## Timers e sessões

O cronômetro da sessão é calculado a partir dos timestamps persistidos, então não depende do número de atualizações do navegador. O controle flutuante permite pausar, retomar e encerrar a sessão. O tempo pausado fica fora da duração; ao encerrar, a sessão é concluída e entra no histórico e no progresso do ciclo. Séries concluídas são inseridas na tabela `set_logs`. Descanso é baseado no `rest_seconds` de cada exercício e aceita pular ou adicionar 15 segundos.

## PWA e Vercel

O manifesto e o service worker são gerados por `vite-plugin-pwa` durante o build. O deploy pode usar o preset padrão Vite da Vercel, com diretório de saída `dist`. Para instalar como PWA, publique em HTTPS e use a opção de instalação do navegador. O ícone fonte está em `public/icons/icon.svg`.

Notificações de descanso não estão ativadas nesta versão. O suporte a notificações depende do navegador e, no iOS, varia conforme a versão e instalação como PWA.

## Estrutura

- `src/App.tsx`: páginas e fluxo da aplicação.
- `src/db.ts`: schema SQLite, seed e persistência IndexedDB.
- `src/styles.css`: layout mobile-first e tema visual.
- `public/exercises`: GIFs dos exercícios.
- `public/icons`: ícone PWA.

## Limitações

Os dados são específicos ao navegador/dispositivo e podem ser removidos pelas configurações de armazenamento do sistema. Esta primeira versão não sincroniza entre dispositivos. Imagens de exercício são placeholders; substitua pelos seus GIFs. O resumo de notificações em background varia de acordo com o suporte do navegador.
