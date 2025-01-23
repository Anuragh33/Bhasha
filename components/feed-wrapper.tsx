type Props = {
  children: React.ReactNode
}

export function FeedWrapper({ children }: Props) {
  return <div className="flex-1 relative top-0 pb-10">{children}</div>
}
