import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/AudioPlayer.module.css";

export const PlayButton = ({ playing, toggleButton }) => {

    return (
        <div>
            <button onClick={toggleButton} className={styles.playPause} >
                {playing ?
                    <FontAwesomeIcon
                        icon={faPause}>

                    </FontAwesomeIcon > :
                    <FontAwesomeIcon
                        icon={faPlay}
                        className={styles.play}>
                    </FontAwesomeIcon>}
            </button>
        </div>
    )
}
