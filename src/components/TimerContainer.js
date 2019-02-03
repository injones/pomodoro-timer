import React, { Component } from 'react';
import TimerControls from './TimerControls';
import { subscribeToTimer } from './api';
import TimesList from './TimesList';

export default class TimerContainer extends Component {
    intervalID = 0; // Global variable used to store Countdown setInterval ID
    breakIntervalID = 0; // Global variable used to store break countdown setInterval ID
    state = { // initialised outside constructor to avoid state undefined errors
        initial: new Date(),
        output: '', // current time in '#m #s' format
        min: 0, // current minutes
        sec: 0, // current seconds
        isPaused: false, // flag for paused or not paused
        timeAmount: 1, // amount to count down in minutes
        message: '', // message to display to user e.g. 'Paused', 'Working' etc
        breakAmount: 0, // number of minutes for each break, default value is zero so functionality is disabled
        current: 0, // current time in milliseconds
        times: [],
        timeAmountAsMilliseconds: function(){
            return milliseconds(this.timeAmount, 0);
        }, // function to convert time amount from minutes to milliseconds
        breakAmountAsMilliseconds: function () {
            return milliseconds(this.breakAmount, 0);
        }, // function to convert break amount from minutes to milliseconds
        timeAmountOutput: function () {
            const target = this.timeAmountAsMilliseconds();
            const tmins = Math.floor((target % (1000 * 60 * 60)) / (1000 * 60));
            const tsecs = Math.floor((target % (1000 * 60)) / 1000);
            return tmins + "m " + tsecs + "s ";
        }
    };

    constructor(props){
        super(props);
        console.log(milliseconds(0.5,0));
        subscribeToTimer({username: 'user', time: this.state.timeAmount}, (err, times) => {
            this.setState({
                times
            }, () => {
                console.log(this.state.times);
            })
        });
    }

    /**
     * Used to workout the target time in milliseconds from minutes, then set the state of the following
     * variables using the time in milliseconds.
     * - output
     * - current
     * Will only be called once after first mount
     */
    componentDidMount(){
        const mm = milliseconds(this.state.timeAmount, 0);
        const mins = Math.floor((mm % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((mm % (1000 * 60)) / 1000);
        this.setState({
            output: mins + "m " + secs + "s ",
            current: mm
        });
    }

    /**
     * Toggles the 'isPaused' boolean declared within the Component state
     */
    togglePause = () => {
        if (this.intervalID !== 0){
            const message = this.state.isPaused ? 'Working' : 'Paused';
            this.setState({
                isPaused: !this.state.isPaused,
                message: message
            })
        }
    };

    /**
     * Handler for 'start' button, if the current time in milliseconds is zero the method assumes the countdown is to
     * be restarted; thus resetting the state and starting the countdown, otherwise it will assume first time use
     * and start the countdown with current state.
     */
    handleStart = () => {
        const target = this.state.timeAmountAsMilliseconds();
        const current = this.state.current;
        if (current === 0){
            this.setState({
                current: target,
                message: '',
                output: this.state.timeAmountOutput()
            }, () => {
                this.countDown();
            }); // Callback function in setState is required to prevent countDown being called before the state
            // is set.
        } else if (current === target){
            this.countDown();
        }
    };

    /**
     * Handler for time input from user, performs input validation to prevent runtime errors will set amount to one
     * if incorrect input, otherwise sets 'timeAmount' and 'current' variables to user input.
     * ('input' should be in minutes)
     * @param e - onChange event
     */
    handleInputChange = e => {
        const input = e.target.value;
        if (input === null || input < 1 || isNaN(input)){
            this.setState({
                timeAmount: 1,
                current: milliseconds(1, 0)
            })
        } else {
            this.setState({
                timeAmount: input,
                current: milliseconds(input, 0)
            })
        }
    };

    /**
     * Handler for break time input from user, performs input validation to prevent runtime errors will set amount to
     * zero if incorrect input, otherwise sets 'timeAmount' and 'current' variables to user input.
     * ('input' should be in minutes)
     * @param e - onChange event
     */
    handleBreakInputChange = e => {
      const input = e.target.value;
        if (input === null || input > 60 || isNaN(input)){
            this.setState({
                breakAmount: 0
            })
        } else {
            this.setState({
                breakAmount: input
            })
        }
    };

    /**
     * Handler for 'reset' button, if the 'intervalID' variable is not equal to zero and the current time in
     * milliseconds is not equal to the target time in milliseconds the method assumes countdown is currently active
     * and will clearInterval of the currently active interval and reset the following Component state variables
     * - current
     * - isPaused
     * - output
     */
    handleReset = () => {
        const target = this.state.timeAmountAsMilliseconds();
        const current = this.state.current;
        if (current !== target && this.intervalID !== 0){
            clearInterval(this.intervalID);
            if (this.breakIntervalID === 0){
                clearInterval(this.breakIntervalID);
            }
            const tmins = Math.floor((target % (1000 * 60 * 60)) / (1000 * 60));
            const tsecs = Math.floor((target % (1000 * 60)) / 1000);
            this.setState({
                current: target,
                isPaused: false,
                output: tmins + "m " + tsecs + "s ",
                message: ''
            })
        }
    };

    /**
     * Count down the 'current' Component state variable by 1000 milliseconds every second till zero.
     * reference: https://www.w3schools.com/howto/howto_js_countdown.asp
     */
    countDown = () => {
        this.setState({
            message: 'Working'
        });
        let n = this.state.current;
        subscribeToTimer({username: 'user', time: minutes(n)}, (err, times) => {
            this.setState({
                times
            });
        });
        this.intervalID = setInterval(() => {
            if (!this.state.isPaused){
                n-=1000;
                const tmins = Math.floor((n % (1000 * 60 * 60)) / (1000 * 60));
                const tsecs = Math.floor((n % (1000 * 60)) / 1000);
                if (this.shouldBreak(n)){
                    clearInterval(this.intervalID);
                    this.setState({
                        message: 'On Break!'
                    });
                    this.breakCountdown();
                }
                if (this.shouldBroadcast(n)){
                    subscribeToTimer({username: 'user', time: minutes(n)}, (err, times) => {
                        this.setState({
                            times
                        }, () => {
                            console.log(this.state.times);
                        })
                    })
                }
                if (n === 0){
                    this.setState({
                        message: 'Time ran out!',
                        current: 0
                    });
                    clearInterval(this.intervalID);
                }
                this.setState({
                    current: n,
                    output: tmins + "m " + tsecs + "s "
                })
            }
        }, 1000);
    };

    shouldBreak = (n) => {
        const difference = milliseconds(this.state.timeAmount, 0) - n;
        if (n === 0 || n === milliseconds(this.state.timeAmount, 0 || this.state.breakAmount === 0)){
            return false; // Don't break when zero or target time
        }
        return difference % milliseconds(this.state.breakAmount, 0) === 0;
    };

    shouldBroadcast = (n) => {
        // broadcast current time amount to the server every minute
        return n % 60000 === 0;
    };

    breakCountdown = () => {
        let time = this.state.breakAmountAsMilliseconds();
        this.breakIntervalID = setInterval(() => {
            time-=1000;
            if (time < 1000){
                clearInterval(this.breakIntervalID); // end break
                this.countDown(); // continue countdown
            }
        }, 1000)
    };


    render(){
        return (
            <div className="timer-container">
                <p>{this.state.output}</p>
                <TimerControls
                    isPaused={this.state.isPaused}
                    timeAmount={this.state.timeAmount}
                    handleInputChange={this.handleInputChange}
                    handleStart={this.handleStart}
                    handleReset={this.handleReset}
                    togglePause={this.togglePause} >
                    {/* Input to set break amount if breaking functionality is to be used */}
                    <input
                        value={this.state.breakAmount}
                        onChange={this.handleBreakInputChange}
                    />
                </TimerControls>
                <p>{this.state.message}</p>
                {/* could move this up */}
                <div>
                    <TimesList times={this.state.times}/>
                </div>
            </div>
        )
    }

}

const milliseconds = (m, s) => ((60+m*60+s)*1000-60000); //https://stackoverflow.com/a/51468455
const minutes = (milliseconds) => (milliseconds/1000/60);
// const milliseconds2 = (m, s) => ((60+m*60+s)*1000-60000);