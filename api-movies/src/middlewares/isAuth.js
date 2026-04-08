import jwt from 'jsonwebtoken'

export const isAuth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ status: 'error', message: 'Token requerido' })

  const token = authorization.split(' ')[1]
  try {
    const { rol, username } = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.rol = rol
    req.username = username
    next()
  } catch {
    return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' })
  }
}