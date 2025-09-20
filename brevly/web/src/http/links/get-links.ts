import axios from 'axios'
import type { Link } from '../../types/links'

interface GetLinksResponseDTO {
  data: Link[]
}

export const getLinks = async (): Promise<GetLinksResponseDTO> => {
  const response = await axios.get<GetLinksResponseDTO>(
    `${import.meta.env.VITE_BACKEND_URL}/links`
  )

  return response.data
}
