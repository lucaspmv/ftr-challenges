import axios from 'axios'
import type { Link } from '../../types/links'

interface CreateLinkRequestDTO {
  originalUrl: string
  slug: string
}

type CreateLinkResponseDTO = Link

export const createLink = async (
  data: CreateLinkRequestDTO
): Promise<CreateLinkResponseDTO> => {
  const response = await axios.post<CreateLinkResponseDTO>(
    `${import.meta.env.VITE_BACKEND_URL}/links`,
    data
  )

  return response.data
}
