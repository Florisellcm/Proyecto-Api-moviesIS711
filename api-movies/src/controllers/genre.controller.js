import Genre from '../service/genre.js'

export const getAllGenres = async (req, res) => {
  const data = await Genre.getAll()
  res.json({ status: 'success', data })
}

export const getGenreById = async (req, res) => {
  const [genre] = await Genre.find(req.params.id)
  if (!genre) return res.status(404).json({ message: 'Genre no encontrado' })
  res.json({ status: 'success', data: genre })
}

export const createGenre = async (req, res) => {
  const data = await Genre.create(req.body)
  res.status(201).json({ status: 'success', data })
}

export const updateGenre = async (req, res) => {
  const [genre] = await Genre.find(req.params.id)
  if (!genre) return res.status(404).json({ message: 'Genre no encontrado' })
  const data = await Genre.update(req.params.id, req.body)
  res.json({ status: 'success', data })
}

export const deleteGenre = async (req, res) => {
  await Genre.delete(req.params.id)
  res.json({ status: 'success', message: 'Genre eliminado' })
}