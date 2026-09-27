import { useEffect } from 'react'

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | چاشنی` : 'چاشنی | طعم خوب، حال خوب'
  }, [title])
}
