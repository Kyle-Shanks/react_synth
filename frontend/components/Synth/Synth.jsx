import React from 'react';
import PropTypes from 'prop-types';
import Knob from 'frontend/components/Knob';
import Effect from 'frontend/components/Effect';
import Select from 'frontend/components/Select';
import Modal from 'frontend/components/Modal';
import { getFreqFromNote, getNoteFromKeyCode } from 'frontend/util/util';
import { keyToNoteMap, scaleOffsets, selectOptions } from 'frontend/util/constants';
import * as Nodes from 'frontend/nodes';
import {
    ComponentContainer,
    SynthContainer,
    InfoToggle,
    EffectRow,
    PresetSelect,
    QSelect,
    TopBar,
    TopSection,
    InfoText,
    AnalyserContainer,
} from './styles';

class Synth extends React.Component {
    constructor(props) {
        super(props);

        this.BASE_CLASS_NAME = 'Synth';
        this.AC = new AudioContext();

        // setting up nodes
        this.volumeNode = new Nodes.Gain(this.AC);
        this.gainNode = new Nodes.Gain(this.AC);
        this.filterNode = new Nodes.Filter(this.AC);
        this.delayNode = new Nodes.Delay(this.AC);
        this.reverbNode = new Nodes.Reverb(this.AC);
        this.distortionNode = new Nodes.Distortion(this.AC);
        this.vibratoLFO = new Nodes.LFO(this.AC);
        this.bitCrusher = new Nodes.BitCrusher(this.AC);

        // Setting up oscillators
        this.osc = new Nodes.Oscillator(this.AC);
        this.oscPanner = new Nodes.StereoPanner(this.AC);
        this.sub1 = new Nodes.Oscillator(this.AC);
        this.sub1Panner = new Nodes.StereoPanner(this.AC);
        this.sub2 = new Nodes.Oscillator(this.AC);
        this.sub2Panner = new Nodes.StereoPanner(this.AC);

        // Analyser Node
        this.analyserNode = this.AC.createAnalyser();
        this.analyserNode.fftSize = 2048;

        // Ids for clearing timeouts
        this.timeoutIds = [];
        this.canvasAnimationId = false;

        // Preset info
        this.presets = {
            '- INIT -': {
                masterVolume: 0.75,
                gainAttack: 0,
                gainDecay: 0,
                gainSustain: 0.7,
                gainRelease: 0,
                vcoType: 'sawtooth',
                vcoGain: 1,
                vcoPan: 0,
                sub1Type: 'sawtooth',
                sub1Offset: 0,
                sub1Pan: 0,
                sub1Gain: 0,
                sub2Type: 'sawtooth',
                sub2Offset: 0,
                sub2Pan: 0,
                sub2Gain: 0,
                delayTime: 0,
                delayFeedback: 0,
                delayTone: 4400,
                delayAmount: 0,
                filterType: 'lowpass',
                filterFreq: 6000,
                filterQ: 0,
                filterAttack: 0,
                filterDecay: 0,
                filterEnvAmount: 0,
                reverbType: 'reverb1',
                reverbAmount: 0,
                portamentoSpeed: 0,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 0,
                vibratoRate: 0,
                bitCrushDepth: 8,
                bitCrushAmount: 0,
            },
            'Dist Saw Chord': {
                masterVolume: 0.8,
                gainAttack: 0.3939393939393939,
                gainDecay: 0.3591,
                gainSustain: 0,
                gainRelease: 0.37424242424242427,
                vcoType: 'sawtooth',
                vcoGain: 0.8,
                vcoPan: 0,
                sub1Type: 'sawtooth',
                sub1Offset: 3,
                sub1Pan: 0,
                sub1Gain: 0.8,
                sub2Type: 'sawtooth',
                sub2Offset: 10,
                sub2Pan: 0,
                sub2Gain: 0.8,
                delayTime: 0,
                delayFeedback: 0,
                delayTone: 4400,
                delayAmount: 0,
                filterType: 'lowpass',
                filterFreq: 2400,
                filterQ: 0,
                filterAttack: 0.39,
                filterDecay: 0.39,
                filterEnvAmount: 909.09,
                reverbType: 'reverb4',
                reverbAmount: 0.125,
                portamentoSpeed: 0,
                distortionDist: 23.75,
                distortionAmount: 0.32575757575757575,
                vibratoDepth: 10.606060606060606,
                vibratoRate: 6.0606060606060606,
                bitCrushDepth: 8,
                bitCrushAmount: 0,
            },
            'Triangle Lead': {
                masterVolume: 0.75,
                gainAttack: 0,
                gainDecay: 0.2,
                gainSustain: 0.4852272727272727,
                gainRelease: 0.2,
                vcoType: 'triangle',
                vcoGain: 1,
                vcoPan: 0,
                sub1Type: 'sawtooth',
                sub1Offset: 0,
                sub1Pan: 0,
                sub1Gain: 0,
                sub2Type: 'sawtooth',
                sub2Offset: 0,
                sub2Pan: 0,
                sub2Gain: 0,
                delayTime: 0.17803030303030304,
                delayFeedback: 0.6893939393939394,
                delayTone: 4400,
                delayAmount: 0.2840909090909091,
                filterType: 'lowpass',
                filterFreq: 2983.3333333333367,
                filterQ: 0,
                filterAttack: 0,
                filterDecay: 0,
                filterEnvAmount: 0,
                reverbType: 'reverb4',
                reverbAmount: 0.14015151515151514,
                portamentoSpeed: 0,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 16.666666666666664,
                vibratoRate: 4.545454545454556,
                bitCrushDepth: 8,
                bitCrushAmount: 0,
            },
            'Sad Square Chord': {
                masterVolume: 0.7,
                gainAttack: 0.5075757575757576,
                gainDecay: 0.5181818181818182,
                gainSustain: 0,
                gainRelease: 0.38939393939393946,
                vcoType: 'square',
                vcoGain: 0.6667,
                vcoPan: 0,
                sub1Type: 'square',
                sub1Offset: 7,
                sub1Pan: 0,
                sub1Gain: 0.6931818181818182,
                sub2Type: 'sine',
                sub2Offset: -12,
                sub2Pan: 0,
                sub2Gain: 1,
                delayTime: 0.30303030303030304,
                delayFeedback: 0.6515151515151515,
                delayTone: 6233.3334,
                delayAmount: 0.29545454545454547,
                filterType: 'lowpass',
                filterFreq: 1650,
                filterQ: 1.931818181818183,
                filterAttack: 0,
                filterDecay: 0,
                filterEnvAmount: 0,
                reverbType: 'reverb4',
                reverbAmount: 0.23863636363636365,
                portamentoSpeed: 0.01,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 9.1,
                vibratoRate: 2.6515151515151514,
                bitCrushDepth: 8,
                bitCrushAmount: 0.1,
            },
            'Plucky Square Lead': {
                masterVolume: 0.6,
                gainAttack: 0,
                gainDecay: 0.25303030303030305,
                gainSustain: 0,
                gainRelease: 0.2,
                vcoType: 'square',
                vcoGain: 0.8484848484848485,
                vcoPan: 0,
                sub1Type: 'square',
                sub1Offset: 0,
                sub1Pan: 0,
                sub1Gain: 0,
                sub2Type: 'square',
                sub2Offset: -12,
                sub2Pan: 0,
                sub2Gain: 0.571969696969697,
                delayTime: 0.1856060606060606,
                delayFeedback: 0.67,
                delayTone: 2566.6666666666674,
                delayAmount: 0.1666666667,
                filterType: 'lowpass',
                filterFreq: 1108.333,
                filterQ: 0,
                filterAttack: 0,
                filterDecay: 0.17,
                filterEnvAmount: 2454.55,
                reverbType: 'reverb1',
                reverbAmount: 0.23484848484848486,
                portamentoSpeed: 0,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 0,
                vibratoRate: 0,
                bitCrushDepth: 6,
                bitCrushAmount: 0.05,
            },
            'Rain Drop Sine Pluck': {
                masterVolume: 0.7803030303030303,
                gainAttack: 0.007575757575757576,
                gainDecay: 0.146969696969697,
                gainSustain: 0,
                gainRelease: 0.16969696969696973,
                vcoType: 'sine',
                vcoGain: 0.8295454545454546,
                vcoPan: 0,
                sub1Type: 'sawtooth',
                sub1Offset: 0,
                sub1Pan: 0,
                sub1Gain: 0,
                sub2Type: 'sawtooth',
                sub2Offset: 0,
                sub2Pan: 0,
                sub2Gain: 0,
                delayTime: 0.3,
                delayFeedback: 0.75,
                delayTone: 7066.666666666668,
                delayAmount: 0.2765151515151515,
                filterType: 'lowpass',
                filterFreq: 2458.3333333333335,
                filterQ: 0,
                filterAttack: 0,
                filterDecay: 0,
                filterEnvAmount: 0,
                reverbType: 'reverb4',
                reverbAmount: 0.11,
                portamentoSpeed: 0,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 0,
                vibratoRate: 0,
                bitCrushDepth: 8,
                bitCrushAmount: 0,
            },
            'Mellow Chimes': {
                masterVolume: 0.8,
                gainAttack: 0.48484848484848486,
                gainDecay: 0.4090909090909091,
                gainSustain: 0,
                gainRelease: 0.17,
                vcoType: 'sine',
                vcoGain: 0.8,
                vcoPan: 0,
                sub1Type: 'sine',
                sub1Offset: 4,
                sub1Pan: 0.6287878787878788,
                sub1Gain: 0.8,
                sub2Type: 'sine',
                sub2Offset: 11,
                sub2Pan: -0.5984848484848485,
                sub2Gain: 0.8,
                delayTime: 0.2840909090909091,
                delayFeedback: 0.7613636363636364,
                delayTone: 3191.666666666666,
                delayAmount: 0.22348484848484848,
                filterType: 'lowpass',
                filterFreq: 1441.6666666666688,
                filterQ: 0,
                filterAttack: 0,
                filterDecay: 0,
                filterEnvAmount: 0,
                reverbType: 'reverb6',
                reverbAmount: 0.7537878787878788,
                portamentoSpeed: 0.025,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 6.0606060606060606,
                vibratoRate: 3.22,
                bitCrushDepth: 12,
                bitCrushAmount: 0.03409090909090909
            },
            'EDM Saw Pluck': {
                masterVolume: 0.7,
                gainAttack: 0,
                gainDecay: 0.48484848484848486,
                gainSustain: 0.296969696969697,
                gainRelease: 0.3106060606060606,
                vcoType: 'sawtooth',
                vcoGain: 0.6667,
                vcoPan: 0,
                sub1Type: 'sawtooth',
                sub1Offset: 7,
                sub1Pan: 0,
                sub1Gain: 0.6931818181818182,
                sub2Type: 'sawtooth',
                sub2Offset: -12,
                sub2Pan: 0,
                sub2Gain: 0.7916666666666666,
                delayTime: 0.125,
                delayFeedback: 0.8106060606060606,
                delayTone: 3900,
                delayAmount: 0.11742424242424243,
                filterType: 'lowpass',
                filterFreq: 191.6666666666664,
                filterQ: 2.3863636363636367,
                filterAttack: 0,
                filterDecay: 0.17424242424242425,
                filterEnvAmount: 4818.181818181823,
                reverbType: 'reverb4',
                reverbAmount: 0.17045454545454544,
                portamentoSpeed: 0,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 0,
                vibratoRate: 0,
                bitCrushDepth: 8,
                bitCrushAmount: 0
            },
            'NostalgiaWave': {
                masterVolume: 0.85,
                gainAttack: 0,
                gainDecay: 0,
                gainSustain: 0.7,
                gainRelease: 0.3787878787878788,
                vcoType: 'sawtooth',
                vcoGain: 1,
                vcoPan: 0,
                sub1Type: 'sawtooth',
                sub1Offset: 10,
                sub1Pan: 0,
                sub1Gain: 1,
                sub2Type: 'sawtooth',
                sub2Offset: 15,
                sub2Pan: 0,
                sub2Gain: 1,
                delayTime: 0.17424242424242425,
                delayFeedback: 0.7765151515151515,
                delayTone: 3483.333333333333,
                delayAmount: 0.20833333333333334,
                filterType: 'lowpass',
                filterFreq: 166.66666666666666,
                filterQ: 1.7045454545454544,
                filterAttack: 0.05303030303030303,
                filterDecay: 0.3106060606060606,
                filterEnvAmount: 4181.818181818182,
                reverbType: 'reverb4',
                reverbAmount: 0.2,
                portamentoSpeed: 0,
                distortionDist: 0,
                distortionAmount: 0,
                vibratoDepth: 9.090909090909092,
                vibratoRate: 34.6590909090909,
                bitCrushDepth: 4,
                bitCrushAmount: 0.015151515151515152
            }
        };

        // Component State
        this.state = {
            // Synth state
            synthActive: false,
            noteHeld: 0,
            octaveMod: 0,
            currentPreset: '- INIT -',
            quantizationKey: false,
            quantizationScale: false,
            analyserActive: false,
            modalActive: false,

            // Knob state
            ...this.presets['- INIT -'],
        };
    }

    componentDidMount = () => this.initSynth();

    // Connect all the nodes together
    initSynth = () => {
        // Master Volume Setup
        this.volumeNode.connect(this.AC.destination);

        // Reverb Setup
        this.reverbNode.connect(this.volumeNode.getNode());
        this.reverbNode.connect(this.analyserNode);

        // Bit Crusher Setup
        this.bitCrusher.connect(this.reverbNode.getDryInput());
        this.bitCrusher.connect(this.reverbNode.getWetInput());

        // Delay Setup
        this.delayNode.connect(this.bitCrusher.getDryInput());
        this.delayNode.connect(this.bitCrusher.getWetInput());

        // Gain Setup
        this.gainNode.connect(this.delayNode.getDryInput());
        this.gainNode.connect(this.delayNode.getWetInput());
        this.gainNode.setGain(0);

        // Filter Setup
        this.filterNode.connect(this.gainNode.getNode());

        // Distortion Setup
        this.distortionNode.connect(this.filterNode.getNode());

        // Oscillater and Subs Setup
        this.osc.connect(this.oscPanner.getNode());
        this.oscPanner.connect(this.distortionNode.getDryInput());
        this.oscPanner.connect(this.distortionNode.getWetInput());
        this.osc.start();
        this.sub1.connect(this.sub1Panner.getNode());
        this.sub1Panner.connect(this.distortionNode.getDryInput());
        this.sub1Panner.connect(this.distortionNode.getWetInput());
        this.sub1.start();
        this.sub2.connect(this.sub2Panner.getNode());
        this.sub2Panner.connect(this.distortionNode.getDryInput());
        this.sub2Panner.connect(this.distortionNode.getWetInput());
        this.sub2.start();

        // Vibrato Setup
        this.vibratoLFO.connect(this.osc.getNode().detune);
        this.vibratoLFO.connect(this.sub1.getNode().detune);
        this.vibratoLFO.connect(this.sub2.getNode().detune);
        this.vibratoLFO.start();

        // Sync node values to state
        this.syncNodesToState();

        // Listen for keys
        this.engageKeyboard();
    }

    // Sync node values to the current state
    syncNodesToState = () => {
        this.volumeNode.setGain(this.state.masterVolume);
        this.osc.setType(this.state.vcoType);
        this.osc.setGain(this.state.vcoGain);
        this.oscPanner.setPan(this.state.vcoPan);
        this.sub1.setType(this.state.sub1Type);
        this.sub1.setGain(this.state.sub1Gain);
        this.sub1Panner.setPan(this.state.sub1Pan);
        this.sub2.setType(this.state.sub2Type);
        this.sub2.setGain(this.state.sub2Gain);
        this.sub2Panner.setPan(this.state.sub2Pan);
        this.delayNode.setDelayTime(this.state.delayTime);
        this.delayNode.setFeedback(this.state.delayFeedback);
        this.delayNode.setTone(this.state.delayTone);
        this.delayNode.setAmount(this.state.delayAmount);
        this.filterNode.setType(this.state.filterType);
        this.filterNode.setFreq(this.state.filterFreq);
        this.filterNode.setQ(this.state.filterQ);
        this.reverbNode.setType(this.state.reverbType);
        this.reverbNode.setAmount(this.state.reverbAmount);
        this.distortionNode.setDistortion(this.state.distortionDist);
        this.distortionNode.setAmount(this.state.distortionAmount);
        this.vibratoLFO.setDepth(this.state.vibratoDepth);
        this.vibratoLFO.setRate(this.state.vibratoRate);
        this.bitCrusher.setBitDepth(this.state.bitCrushDepth);
        this.bitCrusher.setAmount(this.state.bitCrushAmount);
    }

    // Set state to a preset and sync node values
    loadPreset = preset => {
        if (this.presets.hasOwnProperty(preset)) {
            this.setState({
                currentPreset: preset,
                ...this.presets[preset]
            }, this.syncNodesToState);
        }
    }

    // Analyser Functions
    startAnalyser = () => {
        this.setState({ analyserActive: true }, () => {
            const scopeCtx = document.getElementById('scope').getContext('2d');
            const spectCtx = document.getElementById('spectrum').getContext('2d');

            scopeCtx.canvas.width = scopeCtx.canvas.clientWidth;
            spectCtx.canvas.width = spectCtx.canvas.clientWidth;

            const draw = () => {
                this.drawSpectrum(this.analyserNode, spectCtx);
                this.drawScope(this.analyserNode, scopeCtx);
                this.canvasAnimationId = requestAnimationFrame(draw);
            }
            draw();
        });
    }
    stopAnalyser = () => {
        this.setState({ analyserActive: false }, () => {
            cancelAnimationFrame(this.canvasAnimationId);
        });
    }
    drawSpectrum = (analyser, ctx) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        const scaling = height / 260;

        analyser.getByteFrequencyData(freqData);

        ctx.fillStyle = 'rgba(5, 21, 25, 1)'; // Fade
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgb(0, 255, 255)';
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
            ctx.lineTo(x, height - freqData[x] * scaling);
        }

        ctx.stroke();
    }
    drawScope = (analyser, ctx) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const timeData = new Uint8Array(analyser.frequencyBinCount);
        const scaling = height / 256;
        let risingEdge = 0;
        const edgeThreshold = 0.5;

        analyser.getByteTimeDomainData(timeData);

        ctx.fillStyle = 'rgba(5, 21, 25, 1)'; // Fade
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgb(0, 255, 255)';
        ctx.beginPath();

        // No buffer overrun protection
        while (timeData[risingEdge++] - 128 > 0 && risingEdge <= width);
        if (risingEdge >= width) risingEdge = 0;

        while (timeData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
        if (risingEdge >= width) risingEdge = 0;

        for (let x = risingEdge; x < timeData.length && x - risingEdge < width; x++) {
            ctx.lineTo(x - risingEdge, height * 1 - timeData[x] * scaling);
        }

        ctx.stroke();
    }

    // Octave Methods
    octaveUp = () => {
        const oct = this.state.octaveMod;
        if (oct < 3) this.setState({octaveMod: oct + 1});
    }
    octaveDown = () => {
        const oct = this.state.octaveMod;
        if (oct > -3) this.setState({ octaveMod: oct - 1});
    }

    // Timeout clear in case I add more things with an envelope in the future (filter?)
    clearTimouts = () => {
        this.timeoutIds.forEach(id => clearTimeout(id));
        this.timeoutIds = [];
    }

    // Note quantization method
    quantizeNote = note => {
        if (!this.state.quantizationKey || !this.state.quantizationScale) return note;
        const scale = scaleOffsets[this.state.quantizationScale].map((offset) => (
            offset + this.state.quantizationKey
        ));
        let noteCheck = note;
        while (noteCheck < this.state.quantizationKey) noteCheck += 12;
        while (noteCheck > this.state.quantizationKey + 12) noteCheck -= 12;

        let offset = 0;
        while (!scale.includes(noteCheck + offset)) offset++;
        return note + offset;
    }

    // Note trigger methods
    noteOn = noteNum => {
        this.clearTimouts();
        this.setState({ noteHeld: noteNum });
        const noteCopy = noteNum; // For checking if key is released before attack is finished
        const {
            gainAttack,
            gainDecay,
            gainSustain,
            masterVolume,
            portamentoSpeed,
            sub1Offset,
            sub2Offset,
            filterAttack,
            filterDecay,
            filterEnvAmount,
        } = this.state;

        // Set note frequency
        const freq = getFreqFromNote(this.quantizeNote(noteNum));
        const subFreq1 = getFreqFromNote(this.quantizeNote(noteNum + sub1Offset));
        const subFreq2 = getFreqFromNote(this.quantizeNote(noteNum + sub2Offset));
        this.osc.setFreq(freq, portamentoSpeed);
        this.sub1.setFreq(subFreq1, portamentoSpeed);
        this.sub2.setFreq(subFreq2, portamentoSpeed);

        // Gain Envelope ADS (R is on release of key in noteOff())
        if (gainAttack) {
            this.gainNode.setGain(0); // Reset Volume
            this.gainNode.setGain(masterVolume, gainAttack); // Attack
            const timeoutId = setTimeout(() => {
                // If attack is complete and the note is still held, decay
                if (noteCopy === this.state.noteHeld) {
                    const sustVolume = this.state.masterVolume * this.state.gainSustain;
                    this.gainNode.setGain(sustVolume, this.state.gainDecay); // Decay
                }
            }, (gainAttack * 1000));
            this.timeoutIds.push(timeoutId);
        } else {
            this.gainNode.setGain(masterVolume); // Reset Volume
            const sustVolume = masterVolume * gainSustain;
            this.gainNode.setGain(sustVolume, gainDecay); // Decay
        }

        // Filter Envelope AD
        if (filterEnvAmount) {
            if (filterAttack) {
                this.filterNode.setDetune(0); // Reset Detune
                this.filterNode.setDetune(filterEnvAmount, filterAttack); // Attack
                const timeoutId = setTimeout(() => {
                    // If attack is complete and the note is still held, decay
                    if (noteCopy === this.state.noteHeld) {
                        this.filterNode.setDetune(0, this.state.filterDecay); // Decay
                    }
                }, (filterAttack * 1000));
                this.timeoutIds.push(timeoutId);
            } else {
                this.filterNode.setDetune(filterEnvAmount); // Reset Detune
                this.filterNode.setDetune(0, filterDecay); // Decay
            }
        }
    }
    noteOff = () => {
        this.clearTimouts();
        this.setState({ noteHeld: 0 });
        this.gainNode.setGain(0, this.state.gainRelease);
        this.filterNode.setDetune(0, this.state.filterDecay); // Should this be 0 or decay?
    }
    noteStop = () => {
        this.clearTimouts();
        this.setState({ noteHeld: 0 });
        this.gainNode.setGain(0);
        this.filterNode.setDetune(0);
    }

    // Keyboard listeners
    keydownFunction = e => {
        if (!this.state.synthActive) {
            this.setState({ synthActive: true });
            this.AC.resume();
        }

        // Additional commands
        switch (e.which) {
            case 90: return this.octaveDown(); // Z
            case 88: return this.octaveUp();   // X
            case 77: return (this.state.analyserActive) ? this.stopAnalyser() : this.startAnalyser(); // M
        };

        // Play note from keyCode
        const note = getNoteFromKeyCode(e.which, this.state.octaveMod);
        if (note && (note !== this.state.noteHeld)) this.noteOn(note);
    }
    keyupFunction = e => {
        const note = getNoteFromKeyCode(e.which, this.state.octaveMod);
        if (note && (note === this.state.noteHeld)) this.noteOff();
    }
    engageKeyboard = () => {
        window.addEventListener('keydown', this.keydownFunction);
        window.addEventListener('keyup', this.keyupFunction);
    }
    disengageKeyboard = () => {
        window.removeEventListener('keydown', this.keydownFunction);
        window.removeEventListener('keyup', this.keyupFunction);
    }

    render() {
        return (
            <ComponentContainer className={`${this.BASE_CLASS_NAME} ${this.props.className}`.trim()}>
                <Modal
                    active={this.state.modalActive}
                    onClose={() => this.setState({ modalActive: false })}
                />
                <SynthContainer>
                    <InfoToggle onClick={() => this.setState({ modalActive: true })}>i</InfoToggle>
                    <TopBar>
                        <TopSection>
                            {/* <InfoText>Analyser</InfoText> */}
                            <InfoText>Octave: {this.state.octaveMod}</InfoText>
                        </TopSection>
                        <TopSection>
                            <PresetSelect
                                onChange={e => {
                                    this.loadPreset(e.target.value);
                                    e.target.blur();
                                }}
                                value={this.state.currentPreset}
                            >
                                {Object.keys(this.presets).map(preset => (
                                    <option key={`preset_${preset}`} value={preset}>{preset}</option>
                                ))}
                            </PresetSelect>
                        </TopSection>
                        <TopSection>
                            Quantize:
                            <QSelect
                                onChange={e => {
                                    this.setState({ quantizationKey: Number(e.target.value) || ''});
                                    e.target.blur();
                                }}
                                value={this.state.quantizationKey}
                            >
                                <option value={false}>-</option>
                                {Object.keys(keyToNoteMap).map(key => (
                                    <option key={`keys_${key}`} value={keyToNoteMap[key]}>{key}</option>
                                ))}
                            </QSelect>
                            <QSelect
                                onChange={e => {
                                    this.setState({ quantizationScale: e.target.value});
                                    e.target.blur();
                                }}
                                value={this.state.quantizationScale}
                            >
                                <option value={false}>-</option>
                                {Object.keys(scaleOffsets).map(scale => (
                                    <option key={`scales_${scale}`} value={scale}>{scale}</option>
                                ))}
                            </QSelect>
                        </TopSection>
                    </TopBar>
                    <EffectRow>
                        <Effect label="Osc" width={2}>
                            <Select
                                label="Waveform"
                                onUpdate={waveform => {
                                    this.osc.setType(waveform);
                                    this.setState({ vcoType: waveform });
                                }}
                                value={this.state.vcoType}
                                options={selectOptions.waveform}
                                wide
                            />
                            <Knob
                                label="Pan"
                                onUpdate={val => {
                                    this.oscPanner.setPan(val);
                                    this.setState({ vcoPan: val });
                                }}
                                value={this.state.vcoPan}
                                type={2}
                            />
                            <Knob
                                label="Gain"
                                onUpdate={val => {
                                    this.osc.setGain(val);
                                    this.setState({ vcoGain: val });
                                }}
                                value={this.state.vcoGain}
                            />
                        </Effect>
                        <Effect label="Sub 1" width={2}>
                            <Select
                                label="Waveform"
                                onUpdate={waveform => {
                                    this.sub1.setType(waveform);
                                    this.setState({ sub1Type: waveform });
                                }}
                                value={this.state.sub1Type}
                                options={selectOptions.waveform}
                                wide
                            />
                            <Knob
                                label="Pan"
                                onUpdate={val => {
                                    this.sub1Panner.setPan(val);
                                    this.setState({ sub1Pan: val });
                                }}
                                value={this.state.sub1Pan}
                                type={2}
                            />
                            <Knob
                                label="Offset"
                                onUpdate={val => {
                                    this.setState({ sub1Offset: val }, () => {
                                        if (this.state.noteHeld) {
                                            const newFreq = getFreqFromNote(
                                                this.quantizeNote(this.state.noteHeld + this.state.sub1Offset)
                                            );
                                            this.sub1.setFreq(newFreq);
                                        }
                                    });
                                }}
                                value={this.state.sub1Offset}
                                type={2}
                                modifier={24}
                                isRounded
                            />
                            <Knob
                                label="Gain"
                                onUpdate={val => {
                                    this.sub1.setGain(val);
                                    this.setState({ sub1Gain: val });
                                }}
                                value={this.state.sub1Gain}
                            />
                        </Effect>
                        <Effect label="Sub 2" width={2}>
                            <Select
                                label="Waveform"
                                onUpdate={waveform => {
                                    this.sub2.setType(waveform);
                                    this.setState({ sub2Type: waveform });
                                }}
                                value={this.state.sub2Type}
                                options={selectOptions.waveform}
                                wide
                            />
                            <Knob
                                label="Pan"
                                onUpdate={val => {
                                    this.sub2Panner.setPan(val);
                                    this.setState({ sub2Pan: val });
                                }}
                                value={this.state.sub2Pan}
                                type={2}
                            />
                            <Knob
                                label="Offset"
                                onUpdate={val => {
                                    this.setState({ sub2Offset: val }, () => {
                                        if (this.state.noteHeld) {
                                            const newFreq = getFreqFromNote(
                                                this.quantizeNote(this.state.noteHeld + this.state.sub2Offset)
                                            );
                                            this.sub2.setFreq(newFreq);
                                        }
                                    });
                                }}
                                value={this.state.sub2Offset}
                                type={2}
                                modifier={24}
                                isRounded
                            />
                            <Knob
                                label="Gain"
                                onUpdate={val => {
                                    this.sub2.setGain(val);
                                    this.setState({ sub2Gain: val });
                                }}
                                value={this.state.sub2Gain}
                            />
                        </Effect>
                        <Effect label="Gain Envelope" width={2}>
                            <Knob
                                label="Attack"
                                onUpdate={val => {
                                    this.setState({ gainAttack: val});
                                }}
                                value={this.state.gainAttack}
                                modifier={2}
                            />
                            <Knob
                                label="Decay"
                                onUpdate={val => {
                                    this.setState({ gainDecay: val});
                                }}
                                value={this.state.gainDecay}
                                modifier={2}
                            />
                            <Knob
                                label="Sustain"
                                onUpdate={val => {
                                    this.setState({ gainSustain: val });
                                }}
                                value={this.state.gainSustain}
                                modifier={0.7}
                            />
                            <Knob
                                label="Release"
                                onUpdate={val => {
                                    this.setState({ gainRelease: val});
                                }}
                                value={this.state.gainRelease}
                                modifier={2}
                            />
                        </Effect>
                        <Effect label="Master" width={1}>
                            <Knob
                                label="Volume"
                                color="#d8cc5f"
                                onUpdate={val => {
                                    this.volumeNode.setGain(val);
                                    this.setState({ masterVolume: val });
                                }}
                                value={this.state.masterVolume}
                            />
                            <Knob
                                label="Glide"
                                onUpdate={val => {
                                    this.setState({ portamentoSpeed: val });
                                }}
                                value={this.state.portamentoSpeed}
                                modifier={0.5}
                            />
                        </Effect>
                    </EffectRow>
                    <EffectRow>
                        <Effect label="Vibrato" width={1}>
                            <Knob
                                label="Depth"
                                onUpdate={val => {
                                    this.vibratoLFO.setDepth(val);
                                    this.setState({ vibratoDepth: val });
                                }}
                                value={this.state.vibratoDepth}
                                modifier={400}
                            />
                            <Knob
                                label="Rate"
                                onUpdate={val => {
                                    this.vibratoLFO.setRate(val);
                                    this.setState({ vibratoRate: val });
                                }}
                                value={this.state.vibratoRate}
                                modifier={50}
                            />
                        </Effect>
                        <Effect label="Drive" width={1}>
                            <Knob
                                label="Distortion"
                                onUpdate={val => {
                                    this.distortionNode.setDistortion(val);
                                    this.setState({ distortionDist: val });
                                }}
                                value={this.state.distortionDist}
                                modifier={30}
                            />
                            <Knob
                                label="Dry/Wet"
                                onUpdate={val => {
                                    this.distortionNode.setAmount(val);
                                    this.setState({ distortionAmount: val });
                                }}
                                value={this.state.distortionAmount}
                            />
                        </Effect>
                        <Effect label="Delay" width={2}>
                            <Knob
                                label="Time"
                                onUpdate={val => {
                                    this.delayNode.setDelayTime(val)
                                    this.setState({ delayTime: val });
                                }}
                                value={this.state.delayTime}
                            />
                            <Knob
                                label="Feedback"
                                onUpdate={val => {
                                    this.delayNode.setFeedback(val)
                                    this.setState({ delayFeedback: val });
                                }}
                                value={this.state.delayFeedback}
                            />
                            <Knob
                                label="Tone"
                                onUpdate={val => {
                                    this.delayNode.setTone(val)
                                    this.setState({ delayTone: val });
                                }}
                                value={this.state.delayTone}
                                modifier={11000}
                            />
                            <Knob
                                label="Dry/Wet"
                                onUpdate={val => {
                                    this.delayNode.setAmount(val)
                                    this.setState({ delayAmount: val });
                                }}
                                value={this.state.delayAmount}
                            />
                        </Effect>
                        <Effect label="Filter" width={3}>
                            <Select
                                label="Type"
                                onUpdate={filter => {
                                    this.filterNode.setType(filter);
                                    this.setState({ filterType: filter });
                                }}
                                value={this.state.filterType}
                                options={selectOptions.filter}
                                wide
                            />
                            <Knob
                                label="Cutoff"
                                onUpdate={val => {
                                    this.filterNode.setFreq(val);
                                    this.setState({ filterFreq: val });
                                }}
                                value={this.state.filterFreq}
                                modifier={11000}
                            />
                            <Knob
                                label="Q"
                                onUpdate={val => {
                                    this.filterNode.setQ(val);
                                    this.setState({ filterQ: val });
                                }}
                                value={this.state.filterQ}
                                modifier={10}
                            />
                            <Knob
                                label="Attack"
                                onUpdate={val => {
                                    this.setState({ filterAttack: val });
                                }}
                                value={this.state.filterAttack}
                                modifier={2}
                            />
                            <Knob
                                label="Decay"
                                onUpdate={val => {
                                    this.setState({ filterDecay: val });
                                }}
                                value={this.state.filterDecay}
                                modifier={2}
                            />
                            <Knob
                                label="Env Amt"
                                onUpdate={val => {
                                    this.setState({ filterEnvAmount: val });
                                }}
                                value={this.state.filterEnvAmount}
                                modifier={12000}
                                type={2}
                            />
                        </Effect>
                        <Effect label="Crush" width={1}>
                            <Knob
                                label="Bit Depth"
                                onUpdate={val => {
                                    this.bitCrusher.setBitDepth(val);
                                    this.setState({ bitCrushDepth: val });
                                }}
                                value={this.state.bitCrushDepth}
                                modifier={14}
                                offset={2}
                                isRounded
                            />
                            <Knob
                                label="Dry/Wet"
                                onUpdate={val => {
                                    this.bitCrusher.setAmount(val);
                                    this.setState({ bitCrushAmount: val });
                                }}
                                value={this.state.bitCrushAmount}
                            />
                        </Effect>
                        <Effect label="Reverb" width={1}>
                            <Select
                                label="Type"
                                onUpdate={reverb => {
                                    this.reverbNode.setType(reverb);
                                    this.setState({ reverbType: reverb });
                                }}
                                value={this.state.reverbType}
                                options={selectOptions.reverb}
                                wide
                            />
                            <Knob
                                label="Dry/Wet"
                                onUpdate={val => {
                                    this.reverbNode.setAmount(val);
                                    this.setState({ reverbAmount: val });
                                }}
                                value={this.state.reverbAmount}
                            />
                        </Effect>
                    </EffectRow>
                    {this.state.analyserActive && (
                        <AnalyserContainer>
                            <canvas id="scope" />
                            <canvas id="spectrum" />
                        </AnalyserContainer>
                    )}
                </SynthContainer>
            </ComponentContainer>
        );
    }
}

Synth.propTypes = {
    className: PropTypes.string,
};

Synth.defaultProps = {
    className: '',
};

export default Synth;
