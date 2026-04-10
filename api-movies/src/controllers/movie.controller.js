import Movie from '../service/movie.js'
import { validateMovieSchema, validatePartialMovieSchema } from '../schemas/movie.schema.js'

// GET /movies
export const getAll = async (req, res) => {
  try {
    const movies = await Movie.getAll()
    res.json({ status: 'success', data: movies })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}

// GET /movies/:id
export const getById = async (req, res) => {
  const { id } = req.params

  try {
    const movie = await Movie.find(id)

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Película no encontrada'
      })
    }

    res.json({ status: 'success', data: movie })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}

// POST /movies
export const createMovie = async (req, res) => {
  const result = validateMovieSchema(req.body)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.format()
    })
  }

  try {
    const movie = await Movie.create(result.data)

    res.status(201).json({
      status: 'success',
      data: movie
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    })
  }
}

// PUT /movies/:id
export const updateMovie = async (req, res) => {
  const result = validatePartialMovieSchema(req.body)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.format()
    })
  }

  try {
    const movie = await Movie.update(req.params.id, result.data)

    res.json({
      status: 'success',
      data: movie
    })
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    })
  }
}

// DELETE /movies/:id
export const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Película no encontrada'
      })
    }

    res.json({
      status: 'success',
      message: 'Película eliminada correctamente'
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}