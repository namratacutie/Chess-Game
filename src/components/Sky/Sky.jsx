import React from 'react'
import cloud from '../../assets/images/cloud.png'
import earth from '../../assets/images/earth.png'
import comet from '../../assets/images/comet.png'
import astronaut from '../../assets/images/astronaut2.png'
import astronaut2 from '../../assets/images/astronaut.png'
import './Sky.css'

const Sky = () => {

    let smallClouds = [];
    let bigClouds = [];

    for (let i = 0; i <= 8; i++) {
        smallClouds.push(
            <div className="cloud"><img src={cloud} /></div>
        )
    }

    for (let j = 0; j <= 5; j++) {
        bigClouds.push(
            <div className="bigcloud"><img src={cloud} /></div>
        )
    }

    return (
        <div className="main-div">
            <div className="parent-clouds">{smallClouds}</div>
            <div className="parent-bigclouds">{bigClouds}</div>
            <div className="parent-earth"><img src={earth} /></div>
            <div className="parent-comet"><img src={comet} /></div>
            <div className="parent-astronaut"><img src={astronaut} /></div>
            <div className="parent-astronaut2"><img src={astronaut2} /></div>
        </div >
    )

}

export default Sky