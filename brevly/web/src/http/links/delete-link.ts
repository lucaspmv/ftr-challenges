import axios from 'axios'

export const deleteLink = async (slug: string) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/links/${slug.replace('brev.ly/', '')}`
  )

  return response.data
}
