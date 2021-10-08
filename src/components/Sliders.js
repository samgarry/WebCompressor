import React, { useState, useRef, useEffect } from 'react'
import styles from "../styles/AudioPlayer.module.css";

//Sliders used to change the compressor options
export const Sliders = (props) => {

    //SLIDER LABEL STATE VARIABLES
    const [threshAmt, setThreshAmt] = useState(-20);
    const [ratioAmt, setRatioAmt] = useState(5);
    const [attAmt, setAttAmt] = useState(100);
    const [relAmt, setRelAmt] = useState(250);

    //SLIDER REFERENCES
    const threshRef = useRef();
    const ratioRef = useRef();
    const attRef = useRef();
    const relRef = useRef();

    //ComponentDidMount --- Set progress bars of sliders to default positions 
    useEffect(() => {
        threshRef.current.style.setProperty('--seek-before-width', `${-rangeConverter(-20, 0, -40, 0, 100) + 100}%`)
        ratioRef.current.style.setProperty('--seek-before-width', `${logPosition(5)}%`)
        attRef.current.style.setProperty('--seek-before-width', `${13.333333333333333333333333333}%`)
        relRef.current.style.setProperty('--seek-before-width', `${25}%`)
    }, [])

    //Function for making ratio slider logarithmic 
    function logSlider(position) {
        // position will be between 0 and 100
        var minp = 1;
        var maxp = 100;

        // The result should be between 100 an 10000000
        var minv = Math.log(1);
        var maxv = Math.log(20);

        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);

        return Math.exp(minv + scale * (position - minp));
    }

    //Function for setting the default ratio value on a logarithmic scale
    function logPosition(value) {
        // position will be between 0 and 100
        var minp = 1;
        var maxp = 100;

        // The result should be between 100 an 10000000
        var minv = Math.log(1);
        var maxv = Math.log(20);

        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);

        return (Math.log(value) - minv) / scale + minp;
    }

    //Convert between ranges
    function rangeConverter(OldValue, oldMin, oldMax, newMin, newMax) {
        var OldRange = (oldMax - oldMin);
        var NewRange = (newMax - newMin);
        var NewValue = (((OldValue - 0) * NewRange) / OldRange) + 0;
        return NewValue;
    }


    //Change Slider Labels and Progress Bars
    const changeSlider = (event) => {
        switch (event.target.id) {
            case "thresh":
                setThreshAmt(parseFloat(event.target.value).toFixed(2));
                threshRef.current.style.setProperty('--seek-before-width', `${-rangeConverter(parseFloat(threshRef.current.value).toFixed(2), 0, -40, 0, 100) + 100}%`)
                break;
            case "rat":
                setRatioAmt(parseFloat(logSlider((event.target.value))).toFixed(1));
                ratioRef.current.style.setProperty('--seek-before-width', `${ratioRef.current.value}%`)
                break;
            case "att":
                setAttAmt(rangeConverter(event.target.value, 0, 1, 0, 1000));
                attRef.current.style.setProperty('--seek-before-width', `${rangeConverter(attRef.current.value, 0, 0.75, 0, 100)}%`)
                break;
            case "rel":
                setRelAmt(rangeConverter(event.target.value, 0, 1, 0, 1000));
                relRef.current.style.setProperty('--seek-before-width', `${rangeConverter(relRef.current.value, 0, 1, 0, 100)}%`)
                break;
            default:
                break;
        }
    }

    return (
        <div className={styles.flexContainer}>
            {/* THRESHOLD SLIDER */}
            <div>
                <div style={{ fontSize: 'smaller' }}> THRESHOLD </div>
                <div className={styles.sliderContainer} style={{ sdlfj: '100px' }} >
                    <input id="thresh" step="0.05" min="-40.00" max="0.00" type="range" className={styles.slider} defaultValue="-20" onChange={(e) => [changeSlider(e), props.onChange(e)]} ref={threshRef} />
                </div>
                <div style={{ fontSize: 'medium' }}> {threshAmt} dB </div>
            </div>


            {/* RATIO SLIDER */}
            <div>
                <div style={{ fontSize: 'smaller' }}> RATIO </div>
                <div className={styles.sliderContainer}>
                    <input id="rat" min="1" max="100" type="range" className={styles.slider} defaultValue={logPosition(5)} onChange={(e) => [changeSlider(e), props.onChange(e)]} ref={ratioRef} />
                </div>
                <div style={{ fontSize: 'medium' }}> {ratioAmt}:1 </div>
            </div>


            {/* ATTACK SLIDER */}
            <div>
                <div style={{ fontSize: 'smaller' }}> ATTACK </div>
                <div className={styles.sliderContainer}>
                    <input id="att" step="0.01" min="0.01" max=".75" type="range" className={styles.slider} defaultValue="0.1" onChange={(e) => [changeSlider(e), props.onChange(e)]} ref={attRef} />
                </div>
                <div style={{ fontSize: 'medium' }}> {attAmt} ms </div>
            </div>


            {/* RELEASE SLIDER */}
            <div>
                <div style={{ fontSize: 'smaller' }}> RELEASE </div>
                <div className={styles.sliderContainer}>
                    <input id="rel" step="0.01" min="0.01" max="1.0" type="range" className={styles.slider} defaultValue="0.25" onChange={(e) => [changeSlider(e), props.onChange(e)]} ref={relRef} />
                </div>
                <div style={{ fontSize: 'medium' }}> {relAmt} ms </div>
            </div>
        </div >
    )
}
