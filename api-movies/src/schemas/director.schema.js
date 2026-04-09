import * as z from 'zod'

const directorSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres')
                       .max(100, 'El nombre no puede superar 100 caracteres')
}).strict()

export const validateDirectorSchema = (director) => directorSchema.safeParse(director)
export const validatePartialDirectorSchema = (director) => directorSchema.partial().safeParse(director)