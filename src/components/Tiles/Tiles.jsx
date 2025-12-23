import React from 'react'
import './Tiles.css'

const Tiles = ({ number }) => {

    if (number % 2 === 0) {
        return (
            <div className="tiles black-tiles"></div>
        )
    }

    else {
        return (
            <div className="tiles white-tiles"></div>
        )
    }
}

export default Tiles