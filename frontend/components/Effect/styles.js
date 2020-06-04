import styled from 'styled-components';
import { relaBlock, relaInline } from 'frontend/styles/util';
import { lightTextColor, effectLabelColor, effectBackgroundColor } from 'frontend/styles/colors';

// Widths
// One knob: 112px
// Two knob: 225px
// Three knob: 338px
// Four knob: 451px

export const ComponentContainer = styled.div`
    ${relaInline}
    margin: 1px 1px 0 0;
    border-radius: 3px;
    background-color: ${effectBackgroundColor};
    color: ${lightTextColor};
    vertical-align: top;
`;

export const Label = styled.h2`
    ${relaBlock}
    margin: 1.125rem auto 1.125rem;
    width: ${props => (112 * props.width) + (props.width - 1)}px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
    color: ${effectLabelColor};
`;

export const KnobContainer = styled.div`
    ${relaBlock}
    display: flex;
    flex-wrap: wrap;
    min-width: 112px;
    width: ${props => (112 * props.width) + (props.width - 1)}px;
    justify-content: space-around;
`;