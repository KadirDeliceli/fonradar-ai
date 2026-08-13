import {useEffect, useState} from "react";
import type {rawGrant} from "../types/rawGrant.ts";
import {fetchAllGrant} from "../api/grantApi.ts";
import {AdminPanel} from "../components/AdminPanel.tsx";

export function AdminPage(){
    const [grants, setGrants ] = useState<rawGrant[]>([])
    const [status, setStatus] = useState<'loading' | 'error' | 'success' | 'empty'>('loading')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{
        async function loadGrants() {
            try {
                const results = await (fetchAllGrant())
                setGrants(results)
                setStatus('success')
            } catch (err) {
                setErrorMessage("Fon listesi alınamadı. Sunucunun çalıştığından emin olun.")
                setStatus('error')
            }
        }

        loadGrants()
    }, [] )

    return(
        <AdminPanel grants={grants} status={status} errorMessage={errorMessage}/>
    )
}