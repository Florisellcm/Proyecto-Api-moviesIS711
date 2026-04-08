import { Router } from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { hasPermission } from '../middlewares/hasPermission.js'
import {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector
} from '../controllers/director.controller.js'

const router = Router()
router.use(isAuth)

router.get('/', hasPermission('director.read'), getAllDirectors)
router.get('/:id', hasPermission('director.read'), getDirectorById)
router.post('/', hasPermission('director.create'), createDirector)
router.put('/:id', hasPermission('director.update'), updateDirector)
router.delete('/:id', hasPermission('director.delete'), deleteDirector)

export default router