import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BrandMarkProps {
  className?: string
  imageClassName?: string
  priority?: boolean
}

export function BrandMark({ className, imageClassName, priority = false }: BrandMarkProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-blue-100',
        className,
      )}
    >
      <Image
        src="/brand/sinad-logo.svg"
        alt="Logo SINAD+"
        width={64}
        height={64}
        priority={priority}
        className={cn('h-full w-full object-contain p-1.5', imageClassName)}
      />
    </span>
  )
}
