import styled from 'styled-components';
import { relaBlock, relaInline } from 'frontend/styles/util';
import {
    svgActiveColor,
    svgInactiveColor,
    selectLabelColor,
    selectBorderColor,
    selectActiveBorderColor,
    selectDropdownBackgroundColor,
} from 'frontend/styles/colors';

export const ComponentContainer = styled.div`
    ${relaBlock}
    width: 5rem;
    padding: 0.5rem 0;
    margin: 0 0.5rem;
    &:hover ${Label}, &:active ${Label} {
        & .label-text {
            opacity: 0;
        }
        & .value-text {
            opacity: 1;
        }
    }
`;

export const Label = styled.h4`
    ${relaBlock}
    margin: 0.5rem auto;
    padding-bottom: 1px;
    text-align: center;
    font-size: 13px;
    color: ${selectLabelColor};
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

export const InputContainer = styled.div`
    ${relaBlock}
    width: 3.375rem;
    margin: 0 auto;
`;

export const Input = styled.div`
    ${relaBlock}
    height: 3.375rem;
    width: 3.375rem;
    border-radius: 0.5rem;
    padding: 0.4rem 2rem 0.4rem 1rem;
    background-color: ${props => props.isDropdownOpen ? selectActiveBorderColor : 'none'};
    overflow: hidden;
    border: 3px solid ${props => props.isDropdownOpen ? selectActiveBorderColor : selectBorderColor};
    transition: 0.25s cubic-bezier(0.6,0,0.2,1);

    &:hover {
        border: 3px solid ${selectActiveBorderColor};
    }

    & > svg {
        position: absolute;
        top: 0;
        left: 0;
        height: 3rem;
        width: 3rem;
        fill: none;
        stroke-width: 2.75;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: ${svgActiveColor};
    }
`;

export const Dropdown = styled.div`
    z-index: 100;
    width: 100px;
    position: absolute;
    padding: 2px;
    top: 50%;
    left: calc(100% + 4px);
    background-color: ${selectDropdownBackgroundColor};
    box-shadow: 0 2px 20px -1px rgba(0,0,0,0.7);
    border-radius: 0.333rem;
    overflow: auto;
    transition: 0.25s cubic-bezier(0.6,0,0.2,1);

    // Toggle Styles
    ${props => props.isOpen
        ? `opacity: 1; pointer-events: all; transform: translate(0, -50%);`
        : `opacity: 0; pointer-events: none; transform: translate(-1rem, -50%);`
    }
`;

export const DropdownSvg = styled.svg`
    ${relaInline}
    height: 3rem;
    width: 3rem;
    fill: none;
    stroke-width: 2.75;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: ${props => props.selected ? svgActiveColor : svgInactiveColor};

    &:hover {
        stroke: ${svgActiveColor};
    }
`;
