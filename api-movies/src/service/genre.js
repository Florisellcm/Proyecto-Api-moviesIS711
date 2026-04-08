import { pool } from '../config/db.js'

class Genre {

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM genres')
    return rows
  }

  static async find(id) {
    const [rows] = await pool.query('SELECT * FROM genres WHERE id=?', [id])
    return rows
  }

  static async create({ name }) {
    const [result] = await pool.query(
      'INSERT INTO genres (name) VALUES (?)',
      [name]
    )
    return { id: result.insertId, name }
  }

  static async update(id, { name }) {
    await pool.query('UPDATE genres SET name=? WHERE id=?', [name, id])
    return { id, name }
  }

  static async delete(id) {
    await pool.query('DELETE FROM genres WHERE id=?', [id])
  }
}

export default Genre