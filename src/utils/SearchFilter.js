import React, { useState } from 'react'
import Controls from './../controls/Controls'
export const useSearchFilter = () => {



    const [searchText, setSearchText] = useState('')

    const SearchInput = () => {
        return (
            <Controls.Input
                label="Search"
                value={searchText}
            />
        )
    }
    return {
        SearchInput,
        searchText,
        setSearchText
    }


}


