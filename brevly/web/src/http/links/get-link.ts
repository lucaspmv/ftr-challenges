import axios from 'axios'
import type { Link } from '../../types/links'

interface GetLinkResponseDTO {
  data: Link
}

export const getLink = async (slug: string): Promise<GetLinkResponseDTO> => {
  const response = await axios.get<GetLinkResponseDTO>(
    `${import.meta.env.VITE_BACKEND_URL}/links/${slug}`
  )

  return response.data
}
