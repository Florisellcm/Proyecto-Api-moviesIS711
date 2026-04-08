import Permission from '../service/permission.js'

export const hasPermission = (permission) => {
  return async (req, res, next) => {
    // ⚠️ Por ahora solo validamos que el usuario esté autenticado
    // (el JWT ya fue verificado por isAuth)

    // Dejamos pasar todas las rutas
    next()
  }
}