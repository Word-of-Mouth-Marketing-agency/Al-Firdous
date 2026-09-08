type PageTitleProps = {
  title: string
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <section className="page-title" aria-labelledby="page-title-heading">
      <div className="site-container">
        <h1 id="page-title-heading">{title}</h1>
      </div>
    </section>
  )
}
