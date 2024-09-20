'use client'
import { Provider } from 'react-redux'
import { AppStore, store } from './store'
import { useRef } from 'react'

interface Props {
    children: React.ReactNode
}
export default function StoreProvider({ children }: Props) {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store()
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}