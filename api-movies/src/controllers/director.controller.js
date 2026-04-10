import Director from '../service/director.js'
import { validateDirectorSchema, validatePartialDirectorSchema } from '../schemas/director.schema.js'

export const getAllDirectors = async (req, res) => {
  try {
    const data = await Director.getAll()
    res.json({ status: 'success', data })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getDirectorById = async (req, res) => {
  try {
    const rows = await Director.find(req.params.id)

    if (!rows.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Director no encontrado'
      })
    }

    res.json({ status: 'success', data: rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const createDirector = async (req, res) => {
  const result = validateDirectorSchema(req.body)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.format()
    })
  }

  try {
    const data = await Director.create(result.data)

    res.status(201).json({
      status: 'success',
      data
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const updateDirector = async (req, res) => {
  const result = validatePartialDirectorSchema(req.body)

  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      errors: result.error.format()
    })
  }

  try {
    const updated = await Director.update(req.params.id, result.data)

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Director no encontrado'
      })
    }

    res.json({
      status: 'success',
      message: 'Director actualizado'
    })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const deleteDirector = async (req, res) => {
  try {
    const deleted = await Director.delete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Director no encontrado'
      })
    }

    res.json({
      status: 'success',
      message: 'Director eliminado'
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}