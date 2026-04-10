import Genre from '../service/genre.js'
import { validateGenre, validatePartialGenre } from '../schemas/genre.schema.js'

export const getAllGenres = async (req, res) => {
  try {
    const data = await Genre.getAll()
    res.json({ status: 'success', data })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getGenreById = async (req, res) => {
  try {
    const [genre] = await Genre.find(req.params.id)

    if (!genre) {
      return res.status(404).json({
        status: 'error',
        message: 'Género no encontrado'
      })
    }

    res.json({ status: 'success', data: genre })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const createGenre = async (req, res) => {
  const result = validateGenre(req.body)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.format()
    })
  }

  try {
    const data = await Genre.create(result.data)

    res.status(201).json({
      status: 'success',
      data
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const updateGenre = async (req, res) => {
  const result = validatePartialGenre(req.body)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.format()
    })
  }

  try {
    const updated = await Genre.update(req.params.id, result.data)

    res.json({
      status: 'success',
      message: 'Género actualizado',
      data: updated
    })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const deleteGenre = async (req, res) => {
  try {
    const deleted = await Genre.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Género no encontrado'
      })
    }

    res.json({
      status: 'success',
      message: 'Género eliminado'
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}