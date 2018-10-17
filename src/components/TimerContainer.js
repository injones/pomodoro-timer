import React, { Component } from 'react';


export default class TimerContainer extends Component {
    intervalID = 0; // Global variable used to store setInterval ID
    state = {
        initial: new Date(),
        output: '',
        min: 0,
        sec: 0,
        isPaused: false,
        timeAmount: 1,
        message: ''
    }; // initialised outside constructor to avoid state undefined errors

    constructor(props){
        super(props);
        console.log(milliseconds2(0, 0));
        console.log(milliseconds2(1, 0));
    }

    /**
     * Used to workout the target time in milliseconds from minutes, then set the state of the following
     * variables using the time in milliseconds.
     * - output
     * - test
     * Will only be called once after first mount
     */
    componentDidMount(){
        const mm = milliseconds(this.state.timeAmount, 0);
        const mins = Math.floor((mm % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((mm % (1000 * 60)) / 1000);
        this.setState({
            output: mins + "m " + secs + "s ",
            test: mm
        })
    }

    /**
     * Toggles the 'isPaused' boolean declared within the Component state
     */
    togglePause = () => {
        this.setState({
            isPaused: !this.state.isPaused
        })
    };

    /**
     * Handler for 'start' button, if the current time in milliseconds is zero the method assumes the countdown is to
     * be restarted; thus resetting the state and starting the countdown, otherwise it will assume first time use
     * and start the countdown with current state.
     */
    handleStart = () => {
        const target = milliseconds(this.state.timeAmount, 0);
        const current = this.state.test;
        if (current === 0){
            this.setState({
                test: target,
                isPaused: false
            });
            this.countDown();
        } else if (current === target){
            this.countDown();
        }
    };

    setTimer = () => {
        this.setState({
            test: milliseconds(this.state.timeAmount, 0)
        })
    };

    /**
     * Handler for time input from user, performs input validation to prevent runtime errors will run with default
     * state, otherwise sets 'timeAmount' and 'test' variables to user input. ('input' should be in minutes)
     * @param e - event for onChange
     */
    handleInputChange = e => {
        const input = e.target.value;
        if (input === null || input < 1 || isNaN(input)){
            this.setState({
                timeAmount: 0,
                test: milliseconds(input, 0)
            })
        } else {
            this.setState({
                timeAmount: input,
                test: milliseconds(input, 0)
            })
        }
    };

    /**
     * Handler for 'reset' button, if the 'intervalID' variable is not equal to zero and the current time in
     * milliseconds is not equal to the target time in milliseconds the method assumes countdown is currently active
     * and will clearInterval of the currently active interval and reset the following Component state variables
     * - test
     * - isPaused
     * - output
     */
    handleReset = () => {
        const target = milliseconds(this.state.timeAmount, 0);
        const current = this.state.test;
        if (current !== target && this.intervalID !== 0){
            clearInterval(this.intervalID);
            const tmins = Math.floor((target % (1000 * 60 * 60)) / (1000 * 60));
            const tsecs = Math.floor((target % (1000 * 60)) / 1000);
            this.setState({
                test: target,
                isPaused: false,
                output: tmins + "m " + tsecs + "s "
            })
        }
    };



    /**
     * Count down the 'test' Component state variable by 1000 milliseconds every second till zero.
     */
    countDown = () => {
        this.intervalID = setInterval(() => {
            if (!this.state.isPaused){
                const n = this.state.test - 1000;
                const tmins = Math.floor((n % (1000 * 60 * 60)) / (1000 * 60));
                const tsecs = Math.floor((n % (1000 * 60)) / 1000);
                if (n < 1000){
                    this.setState({
                        message: 'Time ran out!',
                        test: 0
                    });
                    clearInterval(this.intervalID);
                }
                this.setState({
                    test: n,
                    output: tmins + "m " + tsecs + "s "
                })
            }
        }, 1000);
    };


    render(){
        let buttonText;
        if (this.state.isPaused){
            buttonText = 'Continue';
        } else {
            buttonText = 'Pause';
        }
        return (
            <div className="timer-container">
                <p>{this.state.output}</p>
                <button
                    onClick={this.handleStart}
                >
                    Start
                </button>
                <button
                    onClick={this.togglePause}
                >
                    {buttonText}
                </button>
                <button
                    onClick={this.handleReset}
                >
                    Reset
                </button>
                <input
                    placeholder='Amount in minutes'
                    value={this.state.timeAmount}
                    onChange={this.handleInputChange}
                />
                <p>{this.state.message}</p>
            </div>
        )
    }

}

const milliseconds = (m, s) => ((60+m*60+s)*1000-60000); //https://stackoverflow.com/a/51468455
const milliseconds2 = (m, s) => ((60+m*60+s)*1000-60000);