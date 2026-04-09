import Movie from '../service/movie.js'
import { validateMovieSchema, validatePartialMovieSchema } from '../schemas/movie.schema.js'
// GET /movies
export const getAll = async (req, res) => {
  const movies = await Movie.getAll()
  res.json(movies)
}

// GET /movies/:id
export const getById = async (req, res) => {
  const { id } = req.params
  try {
    const movie = await Movie.find(id)
    if (!movie.length) return res.status(404).json({ message: 'Película no encontrada' })
    res.json(movie[0])
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// POST /movies
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body)
    res.status(201).json({ message: 'Película creada', movie })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT /movies/:id
export const updateMovie = async (req, res) => {
  const result = validatePartialMovieSchema(req.body)
  if (!result.success) return res.status(400).json({ status: 'error', errors: result.error.format() })

  try {
    const movie = await Movie.update(req.params.id, result.data)
    res.json({ status: 'success', data: movie })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

// DELETE /movies/:id
export const deleteMovie = async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await Movie.delete(id)
    if (!deleted) return res.status(404).json({ message: `Pelicula no encontrada` })
    res.json({ message: `Película eliminada correctamente` })
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}