// Seeder de usuarios
// Crea usuarios de prueba en la base de datos
// Convierte contraseñas en texto plano a hash con bcrypt
// Evita duplicados verificando si el usuario ya existe
// Se ejecuta solo una vez para inicializar la BD
//

import { pool } from '../src/config/db.js'
import bcrypt from 'bcrypt'

const users = [
  { username: 'profesor', email: 'profesor@clase.edu', password: '1234' },
  { username: 'alumno1', email: 'alumno1@clase.edu', password: 'abcd' }
]

async function seedUsers() {
  try {
    const saltRounds = 10

    for (const user of users) {
      // Verificar si el usuario ya existe
      const [rows] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [user.email]
      )

      if (rows.length > 0) {
        console.log(` Usuario ${user.email} ya existe, saltando...`)
        continue
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(user.password, saltRounds)

      // Insertar usuario
      await pool.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [user.username, user.email, hashedPassword]
      )

      console.log(` Usuario ${user.username} creado correctamente`)
    }

    console.log("Seed completado")
    process.exit(0)

  } catch (error) {
    console.error(" Error en seed:", error)
    process.exit(1)
  }
}

seedUsers()