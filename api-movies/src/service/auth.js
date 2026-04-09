import { pool  } from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class Auth {

  static async login({ username, password }) {

    const [rows] = await pool.execute(
      "SELECT id, username, email, password_hash FROM users WHERE username = ?",
      [username]
    )

    if (rows.length === 0) {
      throw new Error("Usuario no encontrado")
    }

    const user = rows[0]

    //  comparar password con bcrypt
    const passwordValida = await bcrypt.compare(password, user.password_hash)

    if (!passwordValida) {
      throw new Error("Credenciales incorrectas")
    }

    //  generar JWT (SOLO AQUÍ)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    )

    return {
      username: user.username,
      email: user.email,
      token
    }
  }
}

export default Auth