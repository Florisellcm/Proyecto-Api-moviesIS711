import Permission from '../service/permission.js'

export const hasPermission = (action) => {
  return async (req, res, next) => {
    try {
      const permissions = await Permission.permissions(req.rol)
      if (!permissions.includes(action)) {
        return res.status(403).json({ status: 'error', message: 'Acceso denegado' })
      }
      next()
    } catch (e) {
      return res.status(500).json({ status: 'error', message: 'Error al verificar permisos' })
    }
  }
}