import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector
} from '../controllers/director.controller.js'

const router = Router()

router.use(isAuth)

router.get('/', getAllDirectors)
router.get('/:id', getDirectorById)
router.post('/', createDirector)
router.put('/:id', updateDirector)
router.delete('/:id', deleteDirector)

export default router