import React from "react";
import riverAudio from '../audio/try-it-now_nature_Eventually,_all_things_merge_into_one,_and_a_river_runs_through_it_burgh_gentle_stream_12.wav';
// import restaurantAudio from '../audio/try-it-now_restaurant_audio_hero_BarAmbience30Peopl+TE038201_resampled_to_44100_with_Lather_sunscreen_all_over_yourself._mono_normalized_to_-20_resampled_to_44100_new_bitrate_16at_5_0.wav';
import restaurantAudio from '../audio/120539__nickgar__marimba1.wav';
import styles from "../styles/AudioPlayer.module.css";
import { Sliders } from "./Sliders";
import { Scenes } from "./Scenes";
import { AudioAnalyser } from "./AudioAnalyser";
import { PlayButton } from "./PlayButton";

//Main component of the app that sits in the app.js
class AudioPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            audio: riverAudio,
            playerStarted: false
        };

        //This Binding -- could've done class fields syntax instead for the toggle function
        this.togglePlayPause = this.togglePlayPause.bind(this);
    }

    componentDidMount() {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();

        //Get the Audio Element
        this.audioElement = document.querySelector('audio');

        //Listener for updating play/pause button when audio finishes
        this.audioElement.addEventListener('ended', () => {
            this.togglePlayPause();
        }, false);

        // Pass audio into the audio context
        this.track = this.audioContext.createMediaElementSource(this.audioElement);

        // Create Compressor Node
        this.compressorNode = new DynamicsCompressorNode(this.audioContext, { threshold: -20, ratio: 5, attack: 0.1 });

        // Create Input Analyser Node
        this.analyserNode = new AnalyserNode(this.audioContext);

        //Start Audio Visualizations
        this.setState({ playerStarted: true });

        //Connect the Nodes in the Audio Graph
        this.track.connect(this.compressorNode).connect(this.analyserNode).connect(this.audioContext.destination);
    }

    //Toggle the play/pause button
    togglePlayPause() {
        // check if context is in suspended state (autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const prevValue = this.state.playing;

        this.setState({ playing: !prevValue });
        if (!prevValue) { //if playing was false
            this.audioElement.play();
        }
        else {
            this.audioElement.pause();
        }
    }

    //Convert ratio slider event value to a logarithmic scale
    logSlider(position) {
        // position will be between 0 and 100
        var minp = 0;
        var maxp = 100;

        // The result should be between 100 an 10000000
        var minv = Math.log(1);
        var maxv = Math.log(20);

        // calculate adjustment factor
        var scale = (maxv - minv) / (maxp - minp);

        return Math.exp(minv + scale * (position - minp));
    }

    //Update the compression parameters
    changeCompression = (event) => {
        switch (event.target.id) {
            case "thresh":
                this.compressorNode.threshold.value = event.target.value;
                break;
            case "rat":
                this.compressorNode.ratio.value = this.logSlider(event.target.value);
                break;
            case "att":
                this.compressorNode.attack.value = event.target.value;
                break;
            case "rel":
                this.compressorNode.release.value = event.target.value;
                break;
            default:
                break;
        }
    }

    //Change between the two audio files
    setAudio = (event) => {
        switch (event.target.id) {
            case "river":
                this.setState({ audio: riverAudio });
                break;
            case "restaurant":
                this.setState({ audio: restaurantAudio });
                break;
            default:
                break;

        }
    }

    render() {
        return (
            <div className={styles.audioPlayer}>

                {/* AUDIO */}
                <audio src={this.state.audio} ></audio>

                {/* HEADER */}
                <h2> SAM'S COMPRESSOR </h2>

                {/* Middle Row */}
                <div className={styles.flexContainer}>

                    {/* Dry Audio Input Analyser/Visualizer */}
                    <AudioAnalyser context={this.audioContext} inputNode={this.track} playing={this.state.playing} playerStarted={this.state.playerStarted} />

                    {/* Middle Column */}
                    <div className={styles.middleColumn}>
                        {/* SCENE BUTTONS */}
                        <Scenes onClick={this.setAudio} playing={this.state.playing} toggleButton={this.togglePlayPause} />

                        {/* PLAY/PAUSE BUTTON */}
                        <PlayButton playing={this.state.playing} toggleButton={this.togglePlayPause} />
                    </div>

                    {/* Wet Audio Analyser/Visualizer */}
                    <AudioAnalyser context={this.audioContext} inputNode={this.compressorNode} playing={this.state.playing} playerStarted={this.state.playerStarted} />
                </div>

                {/* SLIDERS */}
                <Sliders onChange={this.changeCompression} />

            </div>
        )
    }
}

export default AudioPlayer;