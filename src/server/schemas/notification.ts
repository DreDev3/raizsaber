import z from 'zod';

export const createNotificationSchema = z.object({
  title: z.string().nonempty('Campo obrigatório'),
  content: z.string().nonempty('Campo obrigatório'),
  link: z.string().optional(),
});

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;