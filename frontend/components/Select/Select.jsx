import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
    ComponentContainer,
    Label,
    InputContainer,
    Input,
    Dropdown,
    DropdownSvg,
} from './styles';

const Select = ({ className, value, label, onUpdate, options, wide }) => {
    const BASE_CLASS_NAME = 'Select';

    // Dropdown State
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const openDropdown = () => setDropdownOpen(true);
    const closeDropdown = () => setDropdownOpen(false);
    const toggleDropdown = () => dropdownOpen ? closeDropdown() : openDropdown();

    // Option State
    const [currentOption, setCurrentOption] = useState(value);

    // Effects
    useEffect(() => onUpdate(currentOption), [currentOption]);
    useEffect(() => setCurrentOption(value), [value]);
    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    // Handling closing the dropdown when clicking outside of the component
    const containerRef = useRef();
    const handleClick = e => {
        if (document.contains(e.target) && !containerRef.current.contains(e.target)) {
            closeDropdown();
        }
    };

    const getCurrentOptionPath = () => {
        const optionInfo = options.find(opt => opt.value === currentOption);
        return optionInfo ? optionInfo.path : 'M 12.5 25 L 37.5 25';
    };

    return (
        <ComponentContainer className={`${BASE_CLASS_NAME} ${className}`.trim()} ref={containerRef}>
            <InputContainer className={`${BASE_CLASS_NAME}__InputContainer`}>
                <Input
                    className={`${BASE_CLASS_NAME}__Input`}
                    onClick={toggleDropdown}
                    isDropdownOpen={dropdownOpen}
                >
                    <svg viewBox="0 0 50 50">
                        <path d={getCurrentOptionPath()}/>
                    </svg>
                </Input>
                <Dropdown className={`${BASE_CLASS_NAME}__Dropdown`} isOpen={dropdownOpen} wide={wide}>
                    {options.map(option => (
                        <DropdownSvg
                            viewBox="0 0 50 50"
                            onClick={() => { setCurrentOption(option.value); closeDropdown(); }}
                            selected={option.value === currentOption}
                            key={`${label}_svg_${option.value}`}
                        >
                            <rect height="40" width="40" x="5" y="5" fill="none" />
                            <path d={option.path} />
                        </DropdownSvg>
                    ))}
                </Dropdown>
            </InputContainer>
            <Label className={`${BASE_CLASS_NAME}__Label`}>
                <div className="label-text">{label}</div>
                <div className="value-text">{currentOption}</div>
            </Label>
        </ComponentContainer>
    );
};

Select.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    onUpdate: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    })),
    wide: PropTypes.bool,
};

Select.defaultProps = {
    className: '',
    value: '',
    onUpdate: () => {},
    options: [],
    wide: false,
};

export default Select;