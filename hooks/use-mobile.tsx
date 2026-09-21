import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const updateSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Modern matchMedia listener with backward compatibility
    if (mql.addEventListener) {
      mql.addEventListener('change', updateSize)
    } else {
      mql.addListener(updateSize)
    }

    window.addEventListener('resize', updateSize, { passive: true })
    updateSize()

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', updateSize)
      } else {
        mql.removeListener(updateSize)
      }
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return isMobile
}