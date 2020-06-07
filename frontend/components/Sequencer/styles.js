import styled from 'styled-components';
import { relaBlock, relaInline } from 'frontend/styles/util';
import { sequencerBackgroundColor, controlBackgroundColor, textColor } from 'frontend/styles/colors';
import { colorAqua } from 'frontend/styles/palette';

export const ComponentContainer = styled.div`
    ${relaBlock}
    display: flex;
    height: 10rem;
    width: 50rem;
    margin: 1rem auto;
    border-radius: 3px;
    overflow: hidden;
    color: ${textColor};
`;

export const ControlContainer = styled.div`
    ${relaInline}
    height: 10rem;
    width: 10rem;
    background-color: ${controlBackgroundColor};
    box-shadow: 0 0 16px rgba(0,0,0,1);
    z-index: 10;
    padding: 0.5rem;
    text-align: center;
`;

export const ControlHeader = styled.h3`
    ${relaBlock}
    font-size: 16px;
    background-color: rgba(0,0,0,0.2);
    padding: 0.25rem;
    text-align: center;
    margin-bottom: 0.5rem;
`;

export const SequenceContainer = styled.div`
    ${relaInline}
    height: 10rem;
    width: 40rem;
    padding: 1rem;
    background-color: ${sequencerBackgroundColor};
`;

export const SequenceGridContainer = styled.div`
    ${relaBlock}
    display: flex;
    justify-content: space-between;
    height: 12px;
    margin-bottom: 0.5rem;
`;

export const SequenceGridBlock = styled.div`
    ${relaInline}
    flex: 1 1 0;
    height: 100%;
    border-radius: 3px;
    background-color: ${props => props.filled ? colorAqua : 'none'};
    border: 2px solid ${colorAqua};
    opacity: ${props => props.filled ? '1' : '0.3'};
    & + & {
        margin-left: 4px;
    }
`;