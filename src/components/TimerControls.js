import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Stateless companion Component/function of TimerContainer, though can be used separately.
 * Provides basic controls to set time, start timer, pause/continue timer, and reset timer from parent
 * @param props - inherited properties (see propTypes object)
 * @returns {*} - UI input controls for the timer
 * @constructor
 */
const TimerControls = (props) => {
    let buttonText;
    if (props.isPaused){
        buttonText = 'Continue';
    } else {
        buttonText = 'Pause';
    }
    return (
        <div className='timer-controls'>
            <button
                onClick={props.handleStart}
            >
                Start
            </button>
            <button
                onClick={props.togglePause}
            >
                {buttonText}
            </button>
            <button
                onClick={props.handleReset}
            >
                Reset
            </button>
            <input
                placeholder='Amount in minutes'
                value={props.timeAmount}
                onChange={props.handleInputChange}
            />
            {/* Add any additional controls */}
            {props.children}
        </div>
    )
};

TimerControls.propTypes = {
    isPaused: PropTypes.bool.isRequired,
    timeAmount: PropTypes.number.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleStart: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    togglePause: PropTypes.func.isRequired
};

export default TimerControls;