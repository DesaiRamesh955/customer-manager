import React from 'react'

const Skeleton = ({ type, count, size }) => {

    return (
        <>
            {Array(count).fill(null).map((e) => (
                <div className={`skeleton ${type}`} style={{ height: `${size}px` }}> </div>
            ))}
        </>
    )
}

export default Skeleton
