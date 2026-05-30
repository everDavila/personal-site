type ImageSet = {
  dark?:  string | null
  light?: string | null
}

type Props = {
  imageSet?: ImageSet
  imageAlt?: string
  children: React.ReactNode
}

export function PageHeader({ imageSet, imageAlt = '', children }: Props) {
  const hasDark  = !!imageSet?.dark
  const hasLight = !!imageSet?.light

  if (!hasDark && !hasLight) return <>{children}</>

  return (
    <div className="page-header-grid">
      <div>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {hasDark && (
          <img
            src={imageSet!.dark!}
            alt={imageAlt}
            className="page-header-image mode-dark-only"
            width={160}
            height={200}
          />
        )}
        {hasLight && (
          <img
            src={imageSet!.light!}
            alt={imageAlt}
            className="page-header-image mode-light-only"
            width={160}
            height={200}
          />
        )}
      </div>
    </div>
  )
}
