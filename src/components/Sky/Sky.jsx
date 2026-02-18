/**
 * Sky.jsx — Cinematic Starfield & Nebula
 * 
 * Enhances the background with twinkling stars and orbiting astronomical bodies.
 */

import React from 'react'
import cloud from '../../assets/images/cloud.png' // Used as nebula
import earth from '../../assets/images/earth.png'
import comet from '../../assets/images/comet.png'
import astronaut from '../../assets/images/astronaut2.png'
import astronaut2 from '../../assets/images/astronaut.png'
import './Sky.css'

const Sky = () => {
    // Generate 100 random stars
    const stars = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2
    }))

    return (
        <div className="sky-container">
            {/* Twinkling Starfield */}
            <div className="starfield">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="star"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDelay: `${star.delay}s`,
                            animationDuration: `${star.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Nebula Clouds */}
            <div className="nebula-layer">
                <img src={cloud} className="nebula nebula-1" alt="" />
                <img src={cloud} className="nebula nebula-2" alt="" />
            </div>

            {/* Astronomical Bodies */}
            <div className="celestial-bodies">
                <div className="orbiting-earth">
                    <img src={earth} alt="Mars" className="planet-mars" />
                </div>

                <img src={comet} className="drifting-comet" alt="" />

                <div className="astronaut-float">
                    <img src={astronaut} className="astronaut-1" alt="" />
                </div>
                <div className="astronaut-float-alt">
                    <img src={astronaut2} className="astronaut-2" alt="" />
                </div>
            </div>
        </div >
    )
}

export default Sky