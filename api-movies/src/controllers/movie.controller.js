import Movie from '../service/movie.js'

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
  const { id } = req.params
  try {
    const movie = await Movie.update(id, req.body)
    res.json({ message: 'Película actualizada', movie })
  } catch (err) {
    if (err.message.includes('no existe')) {
      res.status(404).json({ message: err.message })
    } else {
      res.status(400).json({ message: err.message })
    }
  }
}

// DELETE /movies/:id
export const deleteMovie = async (req, res) => {
  const { id } = req.params
  try {
    const deleted = await Movie.delete(id)
    if (!deleted) return res.status(404).json({ message: `No existe la película con id=${id}` })
    res.json({ message: `Película con id=${id} eliminada correctamente` })
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}