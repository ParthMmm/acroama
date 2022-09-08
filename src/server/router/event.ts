import { createRouter } from './context';
import { z } from 'zod';

export const eventRouter = createRouter().query('getAllEvents', {
  async resolve({ ctx }) {
    return await ctx.prisma.event.findMany({
      include: { artist: true, genre: true },
    });
  },
});
