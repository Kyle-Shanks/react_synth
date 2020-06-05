import React from 'react';
import PropTypes from 'prop-types';
import { ComponentContainer, Label, KnobContainer } from './styles';

const Effect = ({ className, children, label, width }) => {
    const BASE_CLASS_NAME = 'Effect';

    return (
        <ComponentContainer className={`${BASE_CLASS_NAME} ${className}`.trim()}>
            {label && (<Label width={width}>{label}</Label>)}
            <KnobContainer width={width}>
                {children}
            </KnobContainer>
        </ComponentContainer>
    );
};

Effect.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    width: PropTypes.oneOf([1,2,3,4]),
};

Effect.defaultProps = {
    className: '',
    width: 2,
};

export default Effect;