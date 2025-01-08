import FeedWrapper from '@/components/feed-wrapper'
import StickyWrapper from '@/components/sticky-wrapper'

export default function Learn() {
  return (
    <div className="fle flex-row-reverse gap-[48px]">
      <StickyWrapper>my sticky sidebar</StickyWrapper>
      <FeedWrapper>my feed</FeedWrapper>
    </div>
  )
}
