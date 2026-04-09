import * as z from 'zod'

const movieSchema = z.object({
  title: z.string().min(2).max(100),
  director: z.array(z.number().int().positive()).min(1),
  poster_url: z.string().url().nullable(),
  genre: z.array(z.number().int().positive()).min(1).nullable(),
  release_year: z.number().int().min(1800).max(new Date().getFullYear()).nullable(),
  synopsis: z.string().min(10).max(1000).nullable()
}).strict()

export const validateMovieSchema = (movie) => movieSchema.safeParse(movie)
export const validatePartialMovieSchema = (movie) => movieSchema.partial().safeParse(movie)