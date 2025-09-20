import axios from 'axios'

interface ExportLinksCsvResponseDTO {
  reportUrl: string
}

export const exportLinksCsv = async (): Promise<ExportLinksCsvResponseDTO> => {
  const response = await axios.post<ExportLinksCsvResponseDTO>(
    `${import.meta.env.VITE_BACKEND_URL}/links/exports`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  return response.data
}
