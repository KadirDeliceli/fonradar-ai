import {useState} from 'react'
import {fetchMatchedGrants} from "../api/grantApi.ts"
import type {grant} from "../types/grant.ts";
import {FilterPanel} from "../components/FilterPanel.tsx";

export function SearchPage() {
    const [query, setQuery] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [grants, setGrants] = useState<grant[]>([])
    const [rawCount, setRawCount] = useState(0)
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success' | 'empty' | 'lowScore'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const THRESHOLD = 50

    async function handleSearch() {
        if (query.trim() === '') return
        setSearchTerm(query)
        setStatus('loading')
        setErrorMessage('')
        try {
            const results = await fetchMatchedGrants(query)
            console.log('gelen: ', results)
            const highScored = results.filter((grant) => grant.skor >= THRESHOLD)
            setGrants(highScored)
            setRawCount(results.length)

            if (highScored.length > 0) {
                setStatus('success')
            }else if (results.length > 0 ) {
                setStatus('lowScore')
            }else{
                setStatus('empty')
            }
        } catch (err) {
            setErrorMessage('Fonlar alınamadı. Sunucunun çalıştığından emin olun.')
            setGrants([])
            setStatus('error')
        }
    }

    function handleQueryChange(value: string) {
        setQuery(value)
        if (value.trim() === '') {
            setStatus('idle')
            setGrants([])
            setSearchTerm('')
            setErrorMessage('')
        }
    }

    return (
        <FilterPanel
            query={query}
            searchTerm={searchTerm}
            onQueryChange={handleQueryChange}
            onSearch={handleSearch}
            grants={grants}
            rawCount={rawCount}
            status={status}
            errorMessage={errorMessage}
            THRESHOLD={THRESHOLD}
        />
    )
}
