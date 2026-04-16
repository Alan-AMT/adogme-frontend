// modules/dogs/application/parseDogsSearchParams.ts
// Convierte los searchParams de la URL en un DogFilters tipado.
// Vive en /modules para cumplir la regla: páginas de /app no tienen lógica.

import type {
  DogFilters,
  AgeCategory,
  DogSize,
  EnergyLevel,
  DogSex,
  DogStatus,
} from '@/modules/shared/domain/Dog'

type RawParams = { [key: string]: string | string[] | undefined }

function str(params: RawParams, key: string): string | undefined {
  const v = params[key]
  return typeof v === 'string' ? v : undefined
}

export function parseDogsSearchParams(params: RawParams): DogFilters {
  const filters: DogFilters = {}

  const search = str(params, 'search')
  if (search) filters.search = search

  const edadCategoria = str(params, 'edadCategoria')
  if (edadCategoria) filters.edadCategoria = edadCategoria as AgeCategory

  const tamano = str(params, 'tamano')
  if (tamano) filters.tamano = tamano as DogSize

  const nivelEnergia = str(params, 'nivelEnergia')
  if (nivelEnergia) filters.nivelEnergia = nivelEnergia as EnergyLevel

  const sexo = str(params, 'sexo')
  if (sexo) filters.sexo = sexo as DogSex

  const estado = str(params, 'estado')
  if (estado) filters.estado = estado as DogStatus

  const raza = str(params, 'raza')
  if (raza) filters.raza = raza

  const ciudad = str(params, 'ciudad')
  if (ciudad) filters.ciudad = ciudad

  const sortBy = str(params, 'sortBy')
  if (sortBy === 'fechaRegistro' || sortBy === 'compatibilidad' || sortBy === 'nombre') {
    filters.sortBy = sortBy
  }

  const refugioId = str(params, 'refugioId')
  if (refugioId) filters.refugioId = refugioId

  if (str(params, 'aptoNinos')  === 'true') filters.aptoNinos  = true
  if (str(params, 'aptoPerros') === 'true') filters.aptoPerros = true
  if (str(params, 'aptoGatos')  === 'true') filters.aptoGatos  = true
  if (str(params, 'castrado')   === 'true') filters.castrado   = true

  const page = str(params, 'page')
  if (page) {
    const p = parseInt(page, 10)
    if (!isNaN(p) && p > 0) filters.page = p
  }

  return filters
}
