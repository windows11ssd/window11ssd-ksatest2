import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to update isMobile state
    const updateMedia = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Check and set initial value after mount
    if (typeof window !== 'undefined') {
      updateMedia() // Set initial value
      window.addEventListener('resize', updateMedia) // Listen for resize events
    }

    // Cleanup listener on component unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateMedia)
      }
    }
  }, []) // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return isMobile;
}
