type PageTitleProps = {
  title: string
  className?: string
}

export function PageTitle({ title, className }: PageTitleProps) {
  return (
    <section className={['page-title', className].filter(Boolean).join(' ')} aria-labelledby="page-title-heading">
      <div className="site-container">
        <h1 id="page-title-heading">{title}</h1>
      </div>
    </section>
  )
}
