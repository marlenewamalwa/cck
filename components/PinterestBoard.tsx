'use client'

import { useEffect, useRef } from 'react'

export default function PinterestBoard() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const a = document.createElement('a')
    a.setAttribute('data-pin-do', 'embedBoard')
    a.setAttribute('data-pin-board-width', '900')
    a.setAttribute('data-pin-scale-height', '300')
    a.setAttribute('data-pin-scale-width', '115')
    a.href = 'https://www.pinterest.com/ClosetCulture/lookbook/'
    ref.current.appendChild(a)

    const script = document.createElement('script')
    script.src = 'https://assets.pinterest.com/js/pinit.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  return <div ref={ref} style={{ width: '900px', maxWidth: '100%', minHeight: '20px' }} />
}