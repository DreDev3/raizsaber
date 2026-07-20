import { CourseDifficulty } from '@/generated/prisma';
import { z } from 'zod';

const courseLessonSchema = z.object({
    id: z.string(),
  title: z.string().min(1, 'Campo obrigatório'),
  description: z.string().min(1, 'Campo obrigatório'),
  videoId: z.string().min(1, 'Campo obrigatório'),
  durationInMs: z.number().min(1, 'Campo obrigatório'),
  order: z.number().min(1, 'Campo obrigatório'),
});

export const courseModuleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Campo obrigatório'),
  description: z.string().min(1, 'Campo obrigatório'),
  order: z.number().min(1, 'Campo obrigatório'),
  lessons: z.array(courseLessonSchema).min(1, 'Adicione ao menos uma aula')
});

const courseSchema = z.object({
  title: z.string().min(4, 'Campo obrigatório'),
  shortDescription: z.string().optional(),
  description: z.string().min(10, 'Campo obrigatório'),
  price: z.number().min(1, 'Campo obrigatório'),
  discountPrice: z.number().optional(),
  difficulty: z.enum(CourseDifficulty, 'Campo obrigatório'),
  tagIds: z.array(z.string()).min(1, 'Selecione ao menos uma tag'),
  thumbnail: z.instanceof(File, {message: 'Campo obrigatório'}),
});

export const createCourseSchema = courseSchema.extend({
  modules: z.array(courseModuleSchema).min(1, 'Adicione ao menos um módulo')
});

export type CreateCourseModulePayload = z.infer<typeof courseModuleSchema>;

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = courseSchema.extend({
  id: z.string(),
  thumbnail: z.instanceof(File).optional(),
});

export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;