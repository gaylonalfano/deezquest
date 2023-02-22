'use client'

import classNames from 'classnames'
import { ReactNode } from 'react'

interface StatCounterProps {
  img: string
  value: number
  children?: ReactNode
}

export default function StatCounter({
  img,
  value,
  children,
}: StatCounterProps) {
  return (
    <div
      className={classNames(
        'relative flex items-center md:gap-1',
        children && 'w-full',
      )}
    >
      <img
        src={img}
        className={classNames(
          'w-4 h-4 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 opacity-30',
        )}
      />
      {children && (
        <span
          className={classNames(
            'hidden mx-1 md:mx-0 landscape:md:flex opacity-30',
          )}
        >
          {children}
        </span>
      )}
      <span className='text-right font-bold ml-auto'>{value}</span>
    </div>
  )
}
