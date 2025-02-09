import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function InputWithLabel({ id, value, onInputChange, children }) {
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={onInputChange}
                ref={inputRef}
            />
        </>
    );
}

InputWithLabel.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default InputWithLabel;