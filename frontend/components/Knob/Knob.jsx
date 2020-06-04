import React from 'react';
import PropTypes from 'prop-types';
import { defaultKnobColor, knobTrackSvgColor } from 'frontend/styles/colors';
import { ComponentContainer, Label, KnobContainer, KnobSvg, KnobDial } from './styles';

class Knob extends React.Component {
    constructor(props) {
        super(props);
        this.BASE_CLASS_NAME = 'Knob';
        this.maxKnobRotation = 132;

        // Unidirectional vs bidireactional knob styles
        this.typeDashLengths = { 1: 184, 2: 251.5 };
        this.typeValueOffsets = { 1: 132, 2: 0 };
        this.typePaths = {
            1: 'M20,76 A 40 40 0 1 1 80 76',
            2: 'M50.01,10 A 40 40 0 1 1 50 10',
        }

        this.state = {
            active: true,
            rotation: this.getKnobRotationFromValue(this.props.value),
            currentY: 0,
        };
    }

    getValueFromKnobRotation = knobRotation => {
        const { type, modifier, offset, isRounded } = this.props;
        const value = (type === 1)
            ? ((knobRotation + this.maxKnobRotation) / (this.maxKnobRotation * 2))
            : (knobRotation / this.maxKnobRotation);

        const output = value * modifier + offset

        return isRounded ? Math.round(output) : output;
    }
    getKnobRotationFromValue = value => {
        const { type, modifier, offset } = this.props;
        return (type === 1)
            ? (((value - offset) / modifier) * 2 * this.maxKnobRotation) - this.maxKnobRotation
            : ((value - offset) / modifier) * this.maxKnobRotation;
    }

    componentDidUpdate = prevProps => {
        if (prevProps.value !== this.props.value) {
            this.setState({ rotation: this.getKnobRotationFromValue(this.props.value) })
        }
    }

    updateRotation = mouseY => {
        let newRotation = this.state.rotation - (mouseY - this.state.currentY);

        if (newRotation > this.maxKnobRotation) { newRotation = this.maxKnobRotation; }
        else if (newRotation < -this.maxKnobRotation) { newRotation = -this.maxKnobRotation; }

        this.setState({ rotation: newRotation }, () => {
            this.props.onUpdate(this.getValueFromKnobRotation(this.state.rotation));
        });
    }

    handleMouseMove = e => {
        this.updateRotation(e.clientY);
        this.setState({ currentY: e.clientY });
    }
    handleMouseUp = e => {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        this.setState({ currentY: 0 });
    }
    handleMouseDown = e => {
        this.setState({ currentY: e.clientY });
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    getDashOffset = (val, type) => {
        return this.typeDashLengths[type] - (184 / (this.maxKnobRotation * 2)) * (val + this.typeValueOffsets[type]);
    }

    render = () => {
        const { type, color, label } = this.props;

        return (
            <ComponentContainer className={`${this.BASE_CLASS_NAME}`}>
                <KnobContainer
                    className={`${this.BASE_CLASS_NAME}__container`}
                    onMouseDown={this.handleMouseDown}
                >
                    <KnobSvg className={`${this.BASE_CLASS_NAME}__svg`} viewBox="0 0 100 100">
                        <path
                            d={"M20,76 A 40 40 0 1 1 80 76"}
                            stroke={knobTrackSvgColor}
                        />
                        <path
                            d={this.typePaths[type]}
                            stroke={color}
                            strokeDasharray={this.typeDashLengths[type]}
                            style={{
                                strokeDashoffset: this.getDashOffset(this.state.rotation, type),
                            }}
                        />
                    </KnobSvg>
                    <KnobDial
                        className={`${this.BASE_CLASS_NAME}__dial`}
                        style={{ transform: `translate(-50%,-50%) rotate(${this.state.rotation}deg)` }}
                    />
                </KnobContainer>
                <Label>
                    <div className="label-text">{label}</div>
                    <div className="value-text">{
                        Math.round(this.getValueFromKnobRotation(this.state.rotation) * 100)/100
                    }</div>
                </Label>
            </ComponentContainer>
        );
    }
}

Knob.propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    type: PropTypes.oneOf([1,2]),
    onUpdate: PropTypes.func,
    value: PropTypes.number,
    label: PropTypes.string.isRequired,
    isRounded: PropTypes.bool,
    // Defines the multiplier/max for the knob
    modifier: PropTypes.number,
    // Defines the offset/starting point of the knob
    offset: PropTypes.number,
};

Knob.defaultProps = {
    className: '',
    color: defaultKnobColor,
    type: 1,
    onUpdate: () => {},
    value: 0,
    isRounded: false,
    modifier: 1,
    offset: 0,
};

export default Knob;