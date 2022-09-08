import { createRouter } from './context';
import { z } from 'zod';

export const testRouter = createRouter().query('getAll', {
  async resolve({ ctx }) {
    return await ctx.prisma.event.findMany();
  },
});
