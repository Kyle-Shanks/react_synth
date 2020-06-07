import React from 'react';
import PropTypes from 'prop-types';
import Knob from 'frontend/components/Knob';
import Effect from 'frontend/components/Effect';
import Select from 'frontend/components/Select';
import Modal from 'frontend/components/Modal';
import { getFreqFromNote, getNoteFromKeyCode } from 'frontend/util/util';
import { keyToNoteMap, scaleOffsets, selectOptions } from 'frontend/util/constants';
import * as Nodes from 'frontend/nodes';
import presetData from './presetData';
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
        this.presets = presetData;

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

        ctx.fillStyle = 'rgba(23, 33, 32, 1)'; // Fade
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgb(77, 248, 218)';
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

        ctx.fillStyle = 'rgba(23, 33, 31, 1)'; // Fade
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgb(77, 248, 218)';
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

    // Timeout clear in case I add more things with an envelope in the future
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
                                <option value="">-</option>
                                {Object.keys(keyToNoteMap).map(key => (
                                    <option key={`keys_${key}`} value={keyToNoteMap[key]}>{key}</option>
                                ))}
                            </QSelect>
                            <QSelect
                                onChange={e => {
                                    this.setState({ quantizationScale: e.target.value });
                                    e.target.blur();
                                }}
                                value={this.state.quantizationScale}
                            >
                                <option value="">-</option>
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
                            />
                            <Knob
                                label="Gain"
                                onUpdate={val => {
                                    this.osc.setGain(val);
                                    this.setState({ vcoGain: val });
                                }}
                                value={this.state.vcoGain}
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
                            />
                            <Knob
                                label="Gain"
                                onUpdate={val => {
                                    this.sub1.setGain(val);
                                    this.setState({ sub1Gain: val });
                                }}
                                value={this.state.sub1Gain}
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
                            />
                            <Knob
                                label="Gain"
                                onUpdate={val => {
                                    this.sub2.setGain(val);
                                    this.setState({ sub2Gain: val });
                                }}
                                value={this.state.sub2Gain}
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
                        <Effect label="Filter" width={3}>
                            <Select
                                label="Type"
                                onUpdate={filter => {
                                    this.filterNode.setType(filter);
                                    this.setState({ filterType: filter });
                                }}
                                value={this.state.filterType}
                                options={selectOptions.filter}
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
