import Auth from '../service/auth.js'

export default class AuthController {

  static login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Debe enviar username y password"
      })
    }

    try {
      const result = await Auth.login({ username, password })

      res.json({
        status: "success",
        message: "Login exitoso",
        data: result
      })

    } catch (error) {
      console.error(error.message)

      return res.status(401).json({
        status: "error",
        message: error.message
      })
    }
  }
}