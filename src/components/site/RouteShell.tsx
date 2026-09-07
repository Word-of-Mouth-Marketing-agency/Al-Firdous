type RouteShellProps = {
  title: string
}

export function RouteShell({ title }: RouteShellProps) {
  return (
    <main className="min-h-svh bg-surface px-6 py-16 sm:px-10">
      <div className="mx-auto flex min-h-[60svh] max-w-5xl flex-col justify-center gap-5 border-b border-border pb-12">
        <p className="text-sm font-medium tracking-wide text-brand-primary">الفردوس</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-base leading-8 text-muted-foreground">
          هذه واجهة تأسيسية مؤقتة. سيتم تنفيذ التصميم المعتمد في مرحلة لاحقة.
        </p>
      </div>
    </main>
  )
}
