import styled from 'styled-components';
import { relaBlock, fixedFill } from 'frontend/styles/util';

export const ComponentContainer = styled.div`
    ${fixedFill}
    z-index: 100;
    background-color: rgba(0,0,0,0.5);
    opacity: ${props => props.isActive ? '1' : '0'};
    pointer-events: ${props => props.isActive ? 'all' : 'none'};
    transition: 0.25s ease;
`;

export const ModalContainer = styled.div`
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 575px;
    padding: 1.5rem;
    border-radius: 8px;
    background-color: white;
    font-family: 'Roboto Mono', monospace;

    & p {
        ${relaBlock}
        font-size: 14px;
        line-height: 1.3;
        margin-bottom: 0.25rem;
    }
`;

export const Header = styled.h2`
    ${relaBlock}
    font-size: 20px;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    font-weight: 500;

    * + & {
        margin-top: 1.5rem;
    }
`;

export const Note = styled.h4`
    ${relaBlock}
    margin-top: 1.5rem;
    color: #999;
    font-size: 14px;
    text-transform: uppercase;
    text-align: right;
`;