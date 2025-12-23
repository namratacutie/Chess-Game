import React from 'react'
import '../styles/Chessboard.css'

const Chessboard = () => {

    const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]
    let board = []

    for (let j = yAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < xAxis.length; i++) {
            if ((i + j + 2) % 2 == 0) {
                board.push(
                    <div className="tile black-tile"></div>
                )
            }

            else {
                board.push(
                    <div className="tile white-tile"></div>
                )
            }
        }
    }

    return (
        <div className="chess-board">{board}</div>
    )
}

export default Chessboard