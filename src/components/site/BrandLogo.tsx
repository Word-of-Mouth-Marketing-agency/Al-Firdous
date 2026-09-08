import Image from 'next/image'

type BrandLogoProps = {
  inverted?: boolean
}

export function BrandLogo({ inverted = false }: BrandLogoProps) {
  return (
    <Image
      src={
        inverted ? '/images/brand/al-firdous-logo-white.webp' : '/images/brand/al-firdous-logo.webp'
      }
      alt="الفردوس لقطع غيار معدات الخرسانة"
      width={900}
      height={300}
      className="site-logo-image"
      loading={inverted ? 'lazy' : 'eager'}
    />
  )
}
