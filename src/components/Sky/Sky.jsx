import React from 'react'
import cloud from '../../assets/images/cloud.png'
import earth from '../../assets/images/earth.png'
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
        <div>
            <div className="parent-clouds">{smallClouds}</div>
            <div className="parent-bigclouds">{bigClouds}</div>
            <div className="parent-earth"><img src={earth} /></div>
        </div >
    )

}

export default Sky