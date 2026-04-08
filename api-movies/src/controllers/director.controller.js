import Director from '../service/director.js'

export const getAllDirectors = async (req,res)=>{
  const data = await Director.getAll()
  res.json({status:'success', data})
}

export const getDirectorById = async (req,res)=>{
  const [director] = await Director.find(req.params.id)
  if(!director) return res.status(404).json({message:'Director no encontrado'})
  res.json({status:'success', data:director})
}

export const createDirector = async (req,res)=>{
  const data = await Director.create(req.body)
  res.status(201).json({status:'success', data})
}

export const updateDirector = async (req,res)=>{
  const [director] = await Director.find(req.params.id)
  if(!director) return res.status(404).json({message:'Director no encontrado'})
  const data = await Director.update(req.params.id, req.body)
  res.json({status:'success', data})
}

export const deleteDirector = async (req,res)=>{
  await Director.delete(req.params.id)
  res.json({status:'success', message:'Director eliminado'})
}