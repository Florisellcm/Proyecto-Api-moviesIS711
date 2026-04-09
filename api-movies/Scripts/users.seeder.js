import {pool   }from '../config/db.js'
import bcrypt from 'bcrypt'

const users = [
  { username: 'profesor', email: 'profesor@clase.edu', password: '1234' },
  { username: 'alumno1', email: 'alumno1@clase.edu', password: 'abcd' }
]

async function seedUsers() {
  const saltRounds = 10

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, saltRounds)
    await pool.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [user.username, user.email, hashed]
    )
    console.log(`Usuario ${user.username} creado.`)
  }

  process.exit(0)
}

seedUsers()