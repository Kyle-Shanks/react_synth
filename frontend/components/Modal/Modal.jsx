import React from 'react';
import PropTypes from 'prop-types';
import { ComponentContainer, ModalContainer, Header, Note } from './styles';

const Modal = ({ className, active, onClose }) => {
    const BASE_CLASS_NAME = 'Modal';

    return (
        <ComponentContainer
            className={`${BASE_CLASS_NAME} ${className}`.trim()}
            isActive={active}
            onClick={onClose}
        >
            <ModalContainer onClick={e => e.stopPropagation()}>
                <Header>- Info -</Header>
                <p>Monophonic synthesizer built with JS Web Audio API and React</p>
                <Header>- Top Bar Info -</Header>
                <p>On the left is the octave modifier value for the keyboard.</p>
                <p>The dropdown in the center is for synth presets.</p>
                <p>The quantize dropdowns on the right keep the notes of the oscillator and subs in the selected key.</p>
                <Header>- Commands -</Header>
                <p>[z] - Keyboard octave down</p>
                <p>[x] - Keyboard octave up</p>
                <p>[m] - Toggle oscilloscope and spectrum analyser</p>
                <Header>- Node Connection Path -</Header>
                <p>Vibrato LFO -> Osc + Subs -> Distortion -> Filter -> Gain Env -> Delay -> Bit Crusher -> Reverb -> Master Volume -> Out</p>

                <Note>- KJ</Note>
            </ModalContainer>
        </ComponentContainer>
    );
};

Modal.propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
    className: '',
};

export default Modal;