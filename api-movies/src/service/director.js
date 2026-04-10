import { pool } from '../config/db.js'

class Director {

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM directors')
    return rows
  }

  static async find(id) {
    const [rows] = await pool.query('SELECT * FROM directors WHERE id=?', [id])
    return rows
  }

  static async create({ full_name }) {
    const [result] = await pool.query(
      'INSERT INTO directors (full_name) VALUES (?)',
      [full_name]
    )
    return { id: result.insertId, full_name }
  }

  static async update(id, { full_name }) {
    const rows = await this.find(id)
    if (!rows.length) return false

    await pool.query('UPDATE directors SET full_name=? WHERE id=?', [full_name, id])
    return true
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM directors WHERE id=?', [id])
    return result.affectedRows > 0
  }
}

export default Director