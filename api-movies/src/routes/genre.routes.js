import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import {
  getAllGenres,
  getGenreById,createGenre,
  updateGenre,deleteGenre
} from '../controllers/genre.controller.js'

const router = Router()

router.use(isAuth)

router.get('/', getAllGenres)
router.get('/:id', getGenreById)
router.post('/', createGenre)
router.put('/:id', updateGenre)
router.delete('/:id', deleteGenre)

export default router