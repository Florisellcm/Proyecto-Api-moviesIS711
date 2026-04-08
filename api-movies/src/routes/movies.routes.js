import { Router } from 'express'
import { getAll, getById, createMovie, updateMovie, deleteMovie } from '../controllers/movie.controller.js'
import { isAuth } from '../middlewares/isAuth.js'
import { hasPermission } from '../middlewares/hasPermission.js'

const router = Router()

router.use(isAuth)

router.get('/', hasPermission('movie.read'), getAll)
router.get('/:id', hasPermission('movie.read'), getById)
router.post('/', hasPermission('movie.read'),createMovie)     // POST /movies
router.put('/:id',hasPermission('movie.read'), updateMovie)   // PUT /movies/:id
router.delete('/:id', hasPermission('movie.delete'), deleteMovie)

export default router