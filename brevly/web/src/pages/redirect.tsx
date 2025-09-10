import LogoIcon from '../assets/svgs/Logo_Icon.svg'

export function Redirect() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-3">
      <div className="w-full max-w-[580px] flex flex-col items-center gap-6 bg-white py-16 px-3 rounded-lg">
        <img src={LogoIcon} alt="Brev.ly" className="h-11 md:h-12" />
        <h3 className="font-bold text-xl md:text-2xl">Redirecionando...</h3>
        <p className="text-xs md:sm leading-[18px] md:leading[18px] text-gray-500 text-center">
          O link será aberto automaticamente em alguns instantes.
          <br /> Não foi redirecionado?{' '}
          <a href="/" className="underline text-blue-base">
            Acesse aqui
          </a>
        </p>
      </div>
    </div>
  )
}
