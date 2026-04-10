import { Router } from 'express'
import { getAll, getById, createMovie, updateMovie, deleteMovie } from '../controllers/movie.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const router = Router()

router.use(isAuth)

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', createMovie)
router.put('/:id', updateMovie)
router.delete('/:id', deleteMovie)

export default router