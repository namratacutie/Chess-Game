import React from 'react'
import './Chessboard.css'
import Tiles from '../Tiles/Tiles.jsx'

const Chessboard = () => {

    const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]
    let board = []

    for (let j = yAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < xAxis.length; i++) {
            const number = i + j + 2;
            board.push(<Tiles key={`${i}-${j}`} number={number} />)
        }
    }

    return (
        <div className="chess-board">{board}</div>
    )
}

export default Chessboard