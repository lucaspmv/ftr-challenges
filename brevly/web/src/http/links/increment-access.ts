import axios from 'axios'

export const incrementAccess = async (slug: string) => {
  await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/links/${slug}/access`)
}
