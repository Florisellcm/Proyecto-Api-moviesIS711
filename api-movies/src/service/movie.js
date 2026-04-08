import { pool } from '../config/db.js'

export default class Movie {

  // Consultar todas las películas
  static getAll = async () => {
    const query = `
      SELECT m.id, m.title, m.release_year, m.synopsis, m.poster_url,
        GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
        GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      LEFT JOIN movie_directors md ON m.id = md.movie_id
      LEFT JOIN directors d ON md.director_id = d.id
      GROUP BY m.id
    `
    const [rows] = await pool.query(query)
    return rows
  }

  // Consultar película por id
  static find = async (id) => {
    const [rows] = await pool.query(
      `SELECT m.id, m.title, m.release_year, m.synopsis, m.poster_url,
        GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres,
        GROUP_CONCAT(DISTINCT d.full_name SEPARATOR ', ') AS directors
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       LEFT JOIN movie_directors md ON m.id = md.movie_id
       LEFT JOIN directors d ON md.director_id = d.id
       WHERE m.id = ?
       GROUP BY m.id`,
      [id]
    )
    return rows
  }

  // Crear película
  static create = async (movie) => {
    // Validar géneros
    if (movie.genre?.length) {
      const [validGenres] = await pool.query(
        `SELECT id FROM genres WHERE id IN (?)`, [movie.genre]
      )
      const validIds = validGenres.map(g => g.id)
      const invalid = movie.genre.filter(id => !validIds.includes(id))
      if (invalid.length) throw new Error(`Género(s) inválido(s): ${invalid.join(', ')}`)
    }

    // Validar directores
    if (movie.director?.length) {
      const [validDirectors] = await pool.query(
        `SELECT id FROM directors WHERE id IN (?)`, [movie.director]
      )
      const validIds = validDirectors.map(d => d.id)
      const invalid = movie.director.filter(id => !validIds.includes(id))
      if (invalid.length) throw new Error(`Director(es) inválido(s): ${invalid.join(', ')}`)
    }

    // Insertar en tabla movies
    const [result] = await pool.query(
      `INSERT INTO movies (title, release_year, synopsis, poster_url)
       VALUES (?, ?, ?, ?)`,
      [movie.title, movie.release_year, movie.synopsis, movie.poster_url]
    )
    const id = result.insertId

    // Insertar relaciones
    if (movie.genre?.length) {
      const genreValues = movie.genre.map(gId => [id, gId])
      await pool.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`, [genreValues])
    }
    if (movie.director?.length) {
      const directorValues = movie.director.map(dId => [id, dId])
      await pool.query(`INSERT INTO movie_directors (movie_id, director_id) VALUES ?`, [directorValues])
    }

    return { id, ...movie }
  }

  // Actualizar película
  static update = async (id, movie) => {
    const existing = await this.find(id)
    if (!existing.length) throw new Error(`La película con id=${id} no existe`)

    // Validar géneros
    if (movie.genre?.length) {
      const [validGenres] = await pool.query(
        `SELECT id FROM genres WHERE id IN (?)`, [movie.genre]
      )
      const validIds = validGenres.map(g => g.id)
      const invalid = movie.genre.filter(id => !validIds.includes(id))
      if (invalid.length) throw new Error(`Género(s) inválido(s): ${invalid.join(', ')}`)
    }

    // Validar directores
    if (movie.director?.length) {
      const [validDirectors] = await pool.query(
        `SELECT id FROM directors WHERE id IN (?)`, [movie.director]
      )
      const validIds = validDirectors.map(d => d.id)
      const invalid = movie.director.filter(id => !validIds.includes(id))
      if (invalid.length) throw new Error(`Director(es) inválido(s): ${invalid.join(', ')}`)
    }

    // Actualizar tabla movies
    await pool.query(
      `UPDATE movies SET title=?, release_year=?, synopsis=?, poster_url=? WHERE id=?`,
      [movie.title, movie.release_year, movie.synopsis, movie.poster_url, id]
    )

    // Actualizar relaciones
    if (movie.genre?.length) {
      await pool.query(`DELETE FROM movie_genres WHERE movie_id=?`, [id])
      const genreValues = movie.genre.map(gId => [id, gId])
      await pool.query(`INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`, [genreValues])
    }
    if (movie.director?.length) {
      await pool.query(`DELETE FROM movie_directors WHERE movie_id=?`, [id])
      const directorValues = movie.director.map(dId => [id, dId])
      await pool.query(`INSERT INTO movie_directors (movie_id, director_id) VALUES ?`, [directorValues])
    }

    return { id, ...movie }
  }

  // Eliminar película
  static delete = async (id) => {
    const existing = await this.find(id)
    if (!existing.length) return false

    await pool.query(`DELETE FROM movie_directors WHERE movie_id=?`, [id])
    await pool.query(`DELETE FROM movie_genres WHERE movie_id=?`, [id])
    await pool.query(`DELETE FROM movies WHERE id=?`, [id])

    return true
  }
}