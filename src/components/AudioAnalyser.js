import React, { useEffect, useState, useRef, useCallback } from 'react'
import { AudioVisualizer } from './AudioVisualizer';

export const AudioAnalyser = ({ context, inputNode, playing, playerStarted }) => {

    //Analyser Node Reference
    const analyserRef = useRef();

    //Animation Frame Reference
    const rafRef = useRef();

    //Recursion Reference
    const keepAnimating = useRef(true);

    //State
    const [audioData, setAudioData] = useState(); //Sample data
    const [bufferLength, setBufferLength] = useState(null); //FFT Buffer Length

    //Called when component is mounted
    useEffect(() => {
        //Only set up analyser after AudioPlayer is mounted initially and the audio context has been created
        if (context) {

            // Create Input Analyser Node
            analyserRef.current = new AnalyserNode(context);

            //Set Up the Analyser Node
            analyserRef.current.fftSize = 4096; //Bigger size FFT produces smoother results
            setAudioData(new Float32Array(analyserRef.current.fftSize));
            setBufferLength(analyserRef.current.frequencyBinCount);

            //Connect the Analyser to a Web Audio Node's Output
            inputNode.connect(analyserRef.current);
        }
    }, [playerStarted, context, inputNode]);

    const tick = useCallback(() => {
        let dataArray = new Float32Array(analyserRef.current.fftSize)
        analyserRef.current.getFloatTimeDomainData(dataArray);
        setAudioData(dataArray)
        if (keepAnimating.current) {
            rafRef.current = requestAnimationFrame(tick); //Animate 
        } else {
            dataArray.fill(0);
            setAudioData(dataArray);
        }
    }, [])


    //Called when the play/pause button is pressed
    useEffect(() => {

        //If audio is playing, start animation
        if (playing) {
            keepAnimating.current = true;
            rafRef.current = requestAnimationFrame(tick);
        }
        //If audio isn't playing, stop the animation
        else {
            keepAnimating.current = false;
            // cancelAnimationFrame(tick);
            // cancelAnimationFrame(rafRef.current);
        }
    }, [playing, tick]);

    return (
        <div>
            <AudioVisualizer audioData={audioData} bufferLength={bufferLength} />
        </div>
    )
}
