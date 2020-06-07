import React from 'react';
import PropTypes from 'prop-types';
import Knob from 'frontend/components/Knob';
import { uiColor1, uiColor2 } from 'frontend/styles/colors';
import { OFF } from 'frontend/util/constants';
import { getMsFromBpm } from 'frontend/util/util';
import {
    ComponentContainer,
    ControlContainer,
    ControlHeader,
    SequenceContainer,
    SequenceGridContainer,
    SequenceGridBlock
} from './styles';

const seqArray = [65, 68, 72, 75, 77, 80];
const fairySeqArray = [
    86, 79, 75, 72, 84, 79, 75, 72, 83, 79, 75, 72, 84, 79, 75, 72,
    84, 77, 74, 70, 82, 77, 74, 70, 81, 77, 74, 70, 82, 77, 74, 70,
    82, 75, 72, 69, 81, 75, 72, 69, 80, 75, 72, 69, 81, 75, 72, 69,
    81, 74, 70, 67, 79, 74, 70, 67, 78, 74, 70, 67, 79, 74, 70, 67,

    86, 79, 75, 72, 84, 79, 75, 72, 83, 79, 75, 72, 84, 79, 75, 72,
    87, 80, 77, 71, 86, 80, 77, 71, 85, 80, 77, 71, 86, 80, 77, 71,
    89, 79, 75, 72, 87, 79, 75, 72, 86, 79, 75, 72, 87, 79, 75, 72,
    86, 75, 72, 69, 84, 75, 72, 69, 82, 75, 72, 69, 81, 75, 72, 69,
];
const otherSeqArray = [
    65, 69, 76, 77, OFF, 72, OFF, OFF,
    84, 79, OFF, 81, OFF, 76, OFF, OFF
];
const vibratoSeqArray = [
    66, 70, OFF, OFF, 77, OFF, OFF, 75, OFF, OFF, OFF, OFF, OFF, OFF, OFF, 72,
    72, 73, 72, 68, OFF, OFF, 65, OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF, 66,
];

class Sequencer extends React.Component {
    constructor(props) {
        super(props);
        this.BASE_CLASS_NAME = 'Sequencer';

        this.state = {
            seqOn: false,
            steps: 128,
            seqIdx: 0,
            seqTriggerArray: Array(16).fill(false),
            seqOffsetArray: Array(16).fill(0),

            seqTimout: false,
            triggerTime: 0,

            tempo: 340, // bpm
        };
    }

    addStep = () => {
        if (this.state.steps < 15) this.setState({ steps: this.state.steps + 1 });
    }
    removeStep = () => {
        if (this.state.steps > 0) this.setState({ steps: this.state.steps - 1 });
    }

    toggleSeqTrigger = idx => {
        const arr = this.state.seqTriggerArray;
        const currentVal = arr[idx];
        const newSeq = arr.slice(0, idx).concat([!currentVal].concat(arr.slice(idx + 1)));
        this.setState({ seqTriggerArray: newSeq });
    }

    updateSeqOffset = (idx, offset) => {
        const arr = this.state.seqOffsetArray;
        const newSeq = arr.slice(0, idx).concat([offset].concat(arr.slice(idx + 1)));
        this.setState({ seqOffsetArray: newSeq });
    }

    setTempo = val => {
        this.setState({ tempo: val }, () => {
            const currentTime = Date.now();
            const seqDuration = getMsFromBpm(this.state.tempo);

            // if we've already waited longer than the seqDuration
            if (this.state.seqOn && (currentTime - this.state.triggerTime) > seqDuration) {
                clearTimeout(this.state.seqTimeout);
                this.timeoutFunc();
            }
        });
    }

    timeoutFunc = () => {
        const note = fairySeqArray[this.state.seqIdx];
        (note === OFF) ? this.props.noteOff() : this.props.noteOn(note);
        const newSeqIdx = this.state.seqIdx === this.state.steps - 1 ? 0 : this.state.seqIdx + 1;
        this.setState({ triggerTime: Date.now(), seqIdx: newSeqIdx }, () => {
            if (this.state.seqOn) {
                this.setState({
                    seqTimeout: setTimeout(this.timeoutFunc, getMsFromBpm(this.state.tempo))
                });
            }
        });
    }

    seqOn = () => {
        this.props.disengageKeyboard();
        this.setState({ seqOn: true, seqIdx: 0 }, this.timeoutFunc);
    }
    seqOff = () => {
        clearTimeout(this.state.seqTimeout);
        this.props.noteOff();
        this.setState({ seqOn: false }, this.props.engageKeyboard);
    }

    render() {
        return (
            <ComponentContainer className={`${this.BASE_CLASS_NAME} ${this.props.className}`.trim()}>
                <ControlContainer>
                    <ControlHeader>Test Control</ControlHeader>
                    <Knob
                        label="Rate"
                        onUpdate={val => this.setTempo((val * 1395) + 5)}
                        value={(this.state.tempo - 5) / 1395}
                    />
                    <br />
                    <button onClick={this.seqOn}>On</button>
                    <button onClick={this.seqOff}>Off</button>
                </ControlContainer>
                <SequenceContainer>
                    <SequenceGridContainer color={uiColor1} >
                        {this.state.seqTriggerArray.map((step, idx) => (
                            <SequenceGridBlock
                                onClick={() => this.toggleSeqTrigger(idx)}
                                filled={step}
                                key={`Active_Seq_Block_${idx}`}
                            />
                        ))}
                    </SequenceGridContainer>
                </SequenceContainer>
            </ComponentContainer>
        );
    }
}

Sequencer.propTypes = {
    className: PropTypes.string,
    noteOn: PropTypes.func.isRequired,
    noteOff: PropTypes.func.isRequired,
    engageKeyboard: PropTypes.func.isRequired,
    disengageKeyboard: PropTypes.func.isRequired,
};

Sequencer.defaultProps = {
    className: '',
};

export default Sequencer;