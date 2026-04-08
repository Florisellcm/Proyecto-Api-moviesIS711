import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { hasPermission } from '../middlewares/hasPermission.js'
import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genre.controller.js'

const router = Router()
router.use(isAuth)

router.get('/', hasPermission('genre.read'), getAllGenres)
router.get('/:id', hasPermission('genre.read'), getGenreById)
router.post('/', hasPermission('genre.create'), createGenre)
router.put('/:id', hasPermission('genre.update'), updateGenre)
router.delete('/:id', hasPermission('genre.delete'), deleteGenre)

export default router