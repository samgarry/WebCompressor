import React, { useState, useEffect, useRef } from 'react'
import { RoundedRectangle } from './RoundedRectangle';
import '../styles/MeterVisual.css';

export const AudioVisualizer = ({ audioData, bufferLength }) => {

    //State
    const [meterLabel, setMeterLabel] = useState();

    //References to the canvas
    const canvasRef = useRef();

    function draw() {
        const canvas = canvasRef.current;
        canvas.height = 350;
        canvas.width = 15;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, width, height);

        // Compute average power over the interval (RMS)
        let sumOfSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
            sumOfSquares += audioData[i] ** 2;
        }
        const avgPowerDecibels = 10 * Math.log10(sumOfSquares / bufferLength);

        if (avgPowerDecibels === Number.NEGATIVE_INFINITY) {
            setMeterLabel("-∞");
        } else {
            setMeterLabel(avgPowerDecibels.toFixed(1));
        }
        var barHeight = avgPowerDecibels;
        // context.fillStyle = '#ffffff';
        context.fillStyle = 'rgb(' + (barHeight + 100) + ',255,255)';
        context.fillRect(0, logPosition(-barHeight), width, height - logPosition(-barHeight));
    }

    //Make the meter draw logarithmically (for dB)
    function logPosition(frequency) {
        var width_px = 350;
        var min_f = Math.log(1) / Math.log(10),
            max_f = Math.log(60) / Math.log(10),
            range = max_f - min_f,
            position_px = (Math.log(frequency) / Math.log(10) - min_f) / range * width_px;
        return position_px;
    }

    //Called when the audioData array is changed
    useEffect(() => {
        draw(); //Erase the previous visual and draw the new one
    });

    return (
        <div className="meterVisual">
            <div className="overallMeter">
                <RoundedRectangle />
                <canvas width="15" height="350" ref={canvasRef} className="meter" />
                <div className="meterLabel" > {meterLabel} dB </div>
            </div>

        </div >
    )
}
