import { useEffect, useState } from "react"

let hydrating = true;
export const useHydrated = () => {
    const [isHydrated, setIsHydrated] = useState(() => !hydrating)
    useEffect(() => {
        hydrating = false;
        setIsHydrated(true);
    }, [])

    return isHydrated
}