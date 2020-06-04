import styled from 'styled-components';
import { relaBlock, relaInline } from 'frontend/styles/util';
import { knobLabelColor, knobDialBackgroundColor, knobDialTickColor, knobDialBorderColor } from 'frontend/styles/colors';

export const ComponentContainer = styled.div`
    ${relaInline}
    margin: 0 0.5rem 0.5rem;
    vertical-align: top;
    text-align: left;

    &:hover ${Label}, &:active ${Label} {
        & .label-text {
            opacity: 0;
        }
        & .value-text {
            opacity: 1;
        }
    }
`;

export const Label = styled.h2`
    ${relaBlock}
    max-width: 80px;
    margin: -0.75rem auto 0.5rem;
    text-align: center;
    font-size: 13px;
    color: ${knobLabelColor};
    letter-spacing: 1px;

    & > div {
        transition: 0.2s ease;
    }

    & > .value-text {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        opacity: 0;
    }
`;

export const KnobContainer = styled.div`
    ${relaInline}
    height: 80px;
    width: 80px;
`;

export const KnobSvg = styled.svg`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 80px;
    width: 80px;
    transition: 0s;
    & path {
        fill: none;
        stroke-linecap: round;
        stroke-width: 6;
        will-change: stroke-dashoffset;
        transition: 0.3s cubic-bezier(0, 0, 0.24, 1);
    }
`;

export const KnobDial = styled.div`
    position: absolute;
    text-align: center;
    height: 60px;
    width: 60px;
    top: 50%;
    left: 50%;
    border: 6px solid ${knobDialBorderColor};
    border-radius: 100%;
    box-sizing: border-box;
    transform: translate(-50%,-50%);
    background-color: ${knobDialBackgroundColor};

    &::after {
        content: "";
        position: absolute;
        top: 4px;
        height: 10px;
        width: 2px;
        background-color: ${knobDialTickColor};
    }
`;