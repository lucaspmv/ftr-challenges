import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LogoIcon from '../assets/svgs/Logo_Icon.svg'
import { getLink } from '../http/links/get-link'
import { incrementAccess } from '../http/links/increment-access'
import type { Link } from '../types/links'

export function Redirect() {
  const location = useLocation()
  const navigate = useNavigate()

  const [link, setLink] = useState<Link>()

  const pathname = location.pathname

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const slug = pathname.slice(1)
        const response = await getLink(slug)

        if (response?.data.originalUrl) {
          setLink(response.data)
          await incrementAccess(slug)
          window.location.href = response.data.originalUrl
        } else {
          navigate('/404', { replace: true })
        }
      } catch {
        navigate('/404', { replace: true })
      }
    }

    fetchAndRedirect()
  }, [pathname, navigate])

  return (
    <div className="min-h-dvh flex items-center justify-center px-3">
      <div className="w-full max-w-[580px] flex flex-col items-center gap-6 bg-white py-16 px-3 rounded-lg">
        <img src={LogoIcon} alt="Brev.ly" className="h-11 md:h-12" />
        <h3 className="font-bold text-xl md:text-2xl">Redirecionando...</h3>
        <p className="text-xs md:sm leading-[18px] md:leading[18px] text-gray-500 text-center">
          O link será aberto automaticamente em alguns instantes.
          <br /> Não foi redirecionado?{' '}
          <a
            href={link?.originalUrl ?? '/'}
            className="underline text-blue-base"
          >
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  )
}
