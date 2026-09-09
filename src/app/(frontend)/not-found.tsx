import Link from 'next/link'

export default function FrontendNotFound() {
  return (
    <main className="public-page public-page--not-found">
      <section className="public-section site-container not-found-page" aria-labelledby="not-found-title">
        <p className="page-kicker">الفردوس</p>
        <h1 id="not-found-title">الصفحة غير موجودة</h1>
        <p>تعذر العثور على الصفحة المطلوبة.</p>
        <div className="not-found-page__actions">
          <Link href="/" className="button button--primary">العودة للرئيسية</Link>
          <Link href="/products" className="button button--secondary">تصفح المنتجات</Link>
        </div>
      </section>
    </main>
  )
}
