// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { testRouter } from './test';
import { eventRouter } from './event';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('event.', eventRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
