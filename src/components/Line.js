import React from 'react'

//This line sits beneath the two scene buttons in Scenes.js to indicated which one is selected
export const Line = () => {
    return (
        <div
            style={{ borderTop: "2px solid #fff ", marginLeft: 25, marginRight: 25, borderRadius: 100 }}>
            {/* https://stackoverflow.com/questions/48156902/how-can-i-draw-red-horizontal-line-in-react/48156940 */}
        </div>
    )
}
