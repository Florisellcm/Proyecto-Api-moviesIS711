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
    await pool.query('UPDATE directors SET full_name=? WHERE id=?',[full_name,id])
    return { id, full_name }
  }

  static async delete(id) {
    await pool.query('DELETE FROM directors WHERE id=?',[id])
  }
}

export default Director