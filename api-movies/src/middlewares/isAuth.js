import jwt from 'jsonwebtoken'

export const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      status:"error",
      message:"Token requerido"
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({
      status:"error",
      message:"Token inválido"
    })
  }
}