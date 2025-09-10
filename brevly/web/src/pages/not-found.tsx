import ErrorImage from '../assets/svgs/404.svg'

export function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-3">
      <div className="w-full max-w-[580px] flex flex-col items-center gap-6 bg-white py-16 px-5 rounded-lg">
        <img src={ErrorImage} alt="Brev.ly" className="h-19 md:h-21" />
        <h3 className="font-bold text-xl md:text-2xl">Link não encontrado</h3>
        <p className="text-xs md:sm leading-[16px] md:leading[18px] font-semibold text-gray-500 text-center">
          O link que você está tentando acessar não existe, foi removido ou é
          <br />
          uma URL inválida. Saiba mais em{' '}
          <a href="/" className="underline text-blue-base">
            brev.ly
          </a>
          .
        </p>
      </div>
    </div>
  )
}
