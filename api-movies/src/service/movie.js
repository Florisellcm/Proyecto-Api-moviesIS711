import { pool } from '../config/db.js'

export default class Movie {

 
  //  CONSULTAS
 
  static getAll = async () => {
    const [rows] = await pool.query(`
      SELECT m.id, m.title, m.release_year, m.synopsis, m.poster_url,
        GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
        GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      LEFT JOIN movie_directors md ON m.id = md.movie_id
      LEFT JOIN directors d ON md.director_id = d.id
      GROUP BY m.id
    `)
    return rows
  }

  static find = async (id) => {
    const [rows] = await pool.query(`
      SELECT m.id, m.title, m.release_year, m.synopsis, m.poster_url,
        GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
        GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      LEFT JOIN movie_directors md ON m.id = md.movie_id
      LEFT JOIN directors d ON md.director_id = d.id
      WHERE m.id = ?
      GROUP BY m.id
    `, [id])

    return rows[0] || null
  }

  
  //  funciones de validacion que voy a reutilizar en create y update

  static validateExists = async (table, ids = [], label = 'IDs') => {
    if (!ids?.length) return

    const placeholders = ids.map(() => '?').join(',')

    const [rows] = await pool.query(
      `SELECT id FROM ${table} WHERE id IN (${placeholders})`,
      ids
    )

    const valid = rows.map(r => r.id)
    const invalid = ids.filter(id => !valid.includes(id))

    if (invalid.length) {
      throw new Error(`${label} inválidos: ${invalid.join(', ')}`)
    }
  }

  // CREATE
 
  static create = async (movie) => {
    if (!movie) throw new Error('No se recibieron datos')

    await this.validateExists('genres', movie.genre, 'Géneros')
    await this.validateExists('directors', movie.director, 'Directores')

    const [result] = await pool.query(
      `INSERT INTO movies (title, release_year, synopsis, poster_url)
       VALUES (?, ?, ?, ?)`,
      [
        movie.title,
        movie.release_year || null,
        movie.synopsis || null,
        movie.poster_url || null
      ]
    )

    const id = result.insertId

    if (movie.genre?.length) {
      await pool.query(
        `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
        [movie.genre.map(g => [id, g])]
      )
    }

    if (movie.director?.length) {
      await pool.query(
        `INSERT INTO movie_directors (movie_id, director_id) VALUES ?`,
        [movie.director.map(d => [id, d])]
      )
    }

    return { id, ...movie }
  }

  // UPDATE

  static update = async (id, movie) => {

    const existing = await this.find(id)
    if (!existing) throw new Error('La película no existe')

    await this.validateExists('genres', movie.genre, 'Géneros')
    await this.validateExists('directors', movie.director, 'Directores')

    const current = existing

    const title = movie.title ?? current.title
    const release_year = movie.release_year ?? current.release_year
    const synopsis = movie.synopsis ?? current.synopsis
    const poster_url = movie.poster_url ?? current.poster_url

    await pool.query(
      `UPDATE movies
       SET title=?, release_year=?, synopsis=?, poster_url=?
       WHERE id=?`,
      [title, release_year, synopsis, poster_url, id]
    )

    if (movie.genre !== undefined) {
      await pool.query(`DELETE FROM movie_genres WHERE movie_id=?`, [id])

      if (movie.genre?.length) {
        await pool.query(
          `INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
          [movie.genre.map(g => [id, g])]
        )
      }
    }

    if (movie.director !== undefined) {
      await pool.query(`DELETE FROM movie_directors WHERE movie_id=?`, [id])

      if (movie.director?.length) {
        await pool.query(
          `INSERT INTO movie_directors (movie_id, director_id) VALUES ?`,
          [movie.director.map(d => [id, d])]
        )
      }
    }

    return {
      id,
      title,
      release_year,
      synopsis,
      poster_url,
      genre: movie.genre,
      director: movie.director
    }
  }

 
  // DELETE
 
  static delete = async (id) => {

    const existing = await this.find(id)
    if (!existing) return false

    await pool.query(`DELETE FROM movie_directors WHERE movie_id=?`, [id])
    await pool.query(`DELETE FROM movie_genres WHERE movie_id=?`, [id])
    await pool.query(`DELETE FROM movies WHERE id=?`, [id])

    return true
  }
}