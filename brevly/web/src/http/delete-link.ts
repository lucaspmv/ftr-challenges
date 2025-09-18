import axios from 'axios'

export const deleteLink = async (linkId: string) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/links/${linkId}`
  )

  return response.data
}
