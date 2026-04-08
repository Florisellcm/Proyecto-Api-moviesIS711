import Genre from '../service/genre.js'

export const getAllGenres = async (req, res) => {
  try {
    const data = await Genre.getAll()
    res.json({ status: 'success', data })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

export const getGenreById = async (req, res) => {
  try {
    const [genre] = await Genre.find(req.params.id)

    if (!genre)
      return res.status(404).json({ status: 'error', message: 'Genre no encontrado' })

    res.json({ status: 'success', data: genre })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

export const createGenre = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(400).json({ status: 'error', message: 'name requerido' })

    const data = await Genre.create(req.body)
    res.status(201).json({ status: 'success', data })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

export const updateGenre = async (req, res) => {
  try {
    const id = req.params.id

    const [genre] = await Genre.find(id)
    if (!genre)
      return res.status(404).json({ status: 'error', message: 'Genero no encontrado' })

    if (!req.body.name)
      return res.status(400).json({ status: 'error', message: 'nombre requerido' })

    const data = await Genre.update(id, req.body)

    res.json({
      status: 'success',
      message: 'Genre actualizado',
      data
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}

export const deleteGenre = async (req, res) => {
  try {
    const id = req.params.id

    const [genre] = await Genre.find(id)
    if (!genre)
      return res.status(404).json({ status: 'error', message: 'Genero no encontrado' })

    await Genre.delete(id)

    res.json({
      status: 'success',
      message: 'Genero eliminado'
    })
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message })
  }
}