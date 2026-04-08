import * as z from 'zod'

const genreSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido'
  }).min(2, 'Debe tener al menos 2 caracteres')
})

export const validateGenre = (data) => genreSchema.safeParse(data)

export const validatePartialGenre = (data) =>
  genreSchema.partial().safeParse(data)