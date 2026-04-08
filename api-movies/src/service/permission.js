export default class Permission {

  static async permissions(role) {

    // permisos básicos para el proyecto
    if (role === 'admin') {
      return [
        'movie.read','movie.create','movie.update','movie.delete',
        'genre.read','genre.create','genre.update','genre.delete',
        'director.read','director.create','director.update','director.delete'
      ]
    }

    // usuario normal solo lectura
    return ['movie.read','genre.read','director.read']
  }

}