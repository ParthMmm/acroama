import { createRouter } from './context';
import { z } from 'zod';

export const eventRouter = createRouter()
  .query('getAllEvents', {
    async resolve({ ctx }) {
      return await ctx.prisma.event.findMany({
        include: { artist: true, genre: true },
      });
    },
  })
  .query('getEventById', {
    input: z
      .object({
        publicationId: z.string(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.event.findUnique({
        where: { publicationId: input?.publicationId },
        include: { artist: true, genre: true },
      });
    },
  });
