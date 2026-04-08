import express from 'express'
import moviesRoutes from './src/routes/movies.routes.js'
import genreRoutes from './src/routes/genre.routes.js'
import directorRoutes from './src/routes/director.routes.js'
import authRoutes from './src/routes/auth.routes.js'

const app = express()
app.use(express.json())

// Rutas
app.use('/auth', authRoutes)
app.use('/movies', moviesRoutes)
app.use('/genres', genreRoutes)
app.use('/directors', directorRoutes)

app.listen(3000, () => console.log('Server running on port 3000'))