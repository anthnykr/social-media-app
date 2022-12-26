export function Container({children}: {children: React.ReactNode}) {
  return (
    <div className="m-auto max-w-xl">
      {children}
    </div>
  )
}