import styled from 'styled-components';
import { relaBlock, relaInline } from 'frontend/styles/util';
import { colorDarkGrey, colorBlack } from 'frontend/styles/palette';
import {
    lightTextColor,
    synthBackgroundColor,
    synthSelectBackgroundColor,
    synthBorderColor,
} from 'frontend/styles/colors';

export const ComponentContainer = styled.div`
    ${relaBlock}
    padding: 1rem;
    user-select: none;
`;

export const InfoToggle = styled.div`
    position: absolute;
    top: 4px;
    right: -36px;
    padding: 2px 0;
    width: 24px;
    border: 2px solid;
    text-align: center;
    border-radius: 100%;
    cursor: pointer;
    color: ${colorDarkGrey};
    &:hover {
        color: ${colorBlack};
    }
`;

export const SynthContainer = styled.div`
    ${relaBlock}
    background-color: ${synthBackgroundColor};
    width: 944px;
    border-radius: 8px;
    margin: 1rem auto;
    padding: 1rem;
    border: 4px solid ${synthBorderColor};
    box-shadow: 0 2px 20px -1px rgba(0,0,0,0.3);
`;

export const EffectColumn = styled.div`
    ${relaInline}
`;

export const EffectRow = styled.div`
    ${relaBlock}
    display: flex;
    width: 904px;
    margin: 0 auto;
`;

export const TopBar = styled.div`
    ${relaBlock}
    display: flex;
    width: 904px;
    margin: 0 auto 0.25rem;
    text-align: center;
    padding: 0.25rem 0;
`;

export const TopSection = styled.div`
    ${relaInline}
    flex: 1 1 0;
    &:first-child {
        text-align: left;
    }
    &:last-child {
        text-align: right;
    }
`;

export const InfoText = styled.h4`
    ${relaInline}
    vertical-align: sub;
    vertical-align: -webkit-baseline-middle;
    border: 1px solid;
    border-radius: 4px;
    padding: 5px 0.5rem;
    letter-spacing: 1px;
    & + & {
        margin-left: 0.25rem;
    }
`;

const selectStyles = `
    ${relaInline}
    outline: none;
    font-size: 14px;
    border: 4px solid ${synthSelectBackgroundColor};
    background-color: ${synthSelectBackgroundColor};
    color: ${lightTextColor};
    border-radius: 3px;
`;

export const PresetSelect = styled.select`
    ${selectStyles}
    width: 338px;
`;

export const QSelect = styled.select`
    ${selectStyles}
    margin-left: 0.25rem;
`;

export const AnalyserContainer = styled.div`
    ${relaBlock}
    display: flex;
    margin: 0.5rem auto 0;

    & canvas {
        flex: 1 1 0;
        border-radius: 3px;
        height: 100px;

        & + canvas {
            margin-left: 2px;
        }
    }
`;