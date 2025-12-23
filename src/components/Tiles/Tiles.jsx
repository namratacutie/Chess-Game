import React from 'react'
import './Tiles.css'

const Tiles = ({ number, image }) => {

    // Determine tile color based on the number
    // Even numbers create black tiles, odd numbers create white tiles
    // This creates the classic checkerboard pattern
    if (number % 2 === 0) {
        return (
            <div className="tiles black-tiles">
                {/* Render piece image only if one exists on this tile */}
                {image && <img src={image} alt="piece" />}
            </div>
        )
    }
    else {
        return (
            <div className="tiles white-tiles">
                {/* Render piece image only if one exists on this tile */}
                {image && <img src={image} alt="piece" />}
            </div>
        )
    }
}

export default Tiles