import Director from '../service/director.js'
import { validateDirectorSchema, validatePartialDirectorSchema } from '../schemas/director.schema.js'
import { pool } from '../config/db.js' 

// Obtener todos los directores
export const getAllDirectors = async (req, res) => {
  const data = await Director.getAll()
  res.json({ status: 'success', data })
}

// Obtener director por ID
export const getDirectorById = async (req, res) => {
  const [director] = await Director.find(req.params.id)
  if (!director) return res.status(404).json({ status: 'error', message: 'Director no encontrado' })
  res.json({ status: 'success', data: director })
}

// Crear director
export const createDirector = async (req, res) => {
  const result = validateDirectorSchema(req.body)
  if (!result.success) return res.status(400).json({ status: 'error', errors: result.error.format() })

  try {
    const data = await Director.create(result.data)
    res.status(201).json({ status: 'success', data })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

// Actualizar director
 export const updateDirector = async (req, res) => {
  // Validación con safeParse
  const result = validatePartialDirectorSchema(req.body)  // Llamas a la función
if (!result.success) {
  // Para Zod o cualquier esquema formateado
  const errors = result.error.format ? Object.values(result.error.format()).flatMap(e => e._errors) : [result.error.message]
  return res.status(400).json({ status: "error", errors })
}

const { full_name } = result.data
  try {
    const [updateResult] = await pool.execute(
      "UPDATE directors SET full_name = ? WHERE id = ?",
      [full_name, req.params.id]
    )

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "Director no encontrado" })
    }

    res.json({ status: "success", message: "Director actualizado correctamente" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: "error", errors: ["Error interno del servidor"] })
  }
}
// Eliminar director
export const deleteDirector = async (req, res) => {
  const deleted = await Director.delete(req.params.id)
  if (!deleted) return res.status(404).json({ status: 'error', message: 'Director no encontrado' })
  res.json({ status: 'success', message: 'Director eliminado' })
}