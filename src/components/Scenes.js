import React, { useState } from 'react'
import styles from "../styles/AudioPlayer.module.css";
import { Line } from './Line';

//This component shows the two environment buttons to choose between for selecting the sound
export const Scenes = (props) => {
    const [showRiverLine, setShowRiverLine] = useState(true); //Line to show the river image is selected
    const [showRestaurantLine, setShowRestaurantLine] = useState(false); //Line to show the restaurant image is selected

    function changeButton() {
        if (props.playing) {
            props.toggleButton();
        }
    }

    return (
        <div className={styles.flexContainer}>
            {/* RIVER SELECT BUTTON */}
            <div>
                <button id="river" onClick={(e) => [changeButton(), props.onClick(e), setShowRestaurantLine(false), setShowRiverLine(true)]} className={styles.riverImage} ></button>
                {showRiverLine ? <Line /> : null}
            </div>
            {/* RESTAURANT SELECT BUTTON */}
            <div>
                <button id="restaurant" onClick={(e) => [changeButton(), props.onClick(e), setShowRiverLine(false), setShowRestaurantLine(true)]} className={styles.restaurantImage} ></button>
                {showRestaurantLine ? <Line /> : null}
            </div>
        </div>
    )
}
