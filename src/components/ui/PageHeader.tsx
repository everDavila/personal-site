type Props = {
  imageUrl?: string | null
  imageAlt?: string
  children: React.ReactNode
}

/**
 * Wraps page title + subtitle in a two-column grid when an image URL is provided.
 * The right column shows the page-specific character image (e.g. astronaut).
 * With no image, renders children as-is — zero layout change.
 */
export function PageHeader({ imageUrl, imageAlt = '', children }: Props) {
  if (!imageUrl) return <>{children}</>

  return (
    <div className="page-header-grid">
      <div>{children}</div>
      <img
        src={imageUrl}
        alt={imageAlt}
        className="page-header-image"
        width={160}
        height={200}
      />
    </div>
  )
}
