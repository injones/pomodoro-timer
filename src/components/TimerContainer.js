import React, { Component } from 'react';


export default class TimerContainer extends Component {
    intervalID = 0;
    state = {initial: new Date(), output: '', min: 0, sec: 0, isPaused: false, timeAmount: 1, message: ''};

    constructor(props){
        super(props);

    }

    componentDidMount(){
        // const now = new Date().setMinutes(30, 0);
        // const time = now.setSeconds(0).getTime();
        // const now = new Date().getTime();
        const mm = this.milliseconds(this.state.timeAmount, 0);
        const mins = Math.floor((mm % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((mm % (1000 * 60)) / 1000);
        this.setState({
            distance: {},
            output: mins + "m " + secs + "s ",
            test: mm
        })
    }

//     if (distance < 0){
//     return (
// <p>Reached end</p>
// )
// }

    togglePause = () => {
        this.setState({
            isPaused: !this.state.isPaused
        })
    };

    handleStart = () => {
        const target = this.milliseconds(this.state.timeAmount, 0);
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
            test: this.milliseconds(this.state.timeAmount, 0)
        })
    };

    handleInputChange = e => {
        const input = e.target.value;
        if (input === null || input < 0 || isNaN(input)){
            this.setState({
                timeAmount: 0,
                test: this.milliseconds(input, 0)
            })
        } else {
            this.setState({
                timeAmount: input,
                test: this.milliseconds(input, 0)
            })
        }
    };

    handleReset = () => {
        const target = this.milliseconds(this.state.timeAmount, 0);
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

    milliseconds = (m, s) => ((60+m*60+s)*1000); //https://stackoverflow.com/a/51468455

    countDown = () => {
        const init = new Date().getTime();
        this.intervalID = setInterval(() => {
            if (!this.state.isPaused){
                const time = new Date().getTime();
                const distance = time - init;
                const n = this.state.test - 1000;
                const tmins = Math.floor((n % (1000 * 60 * 60)) / (1000 * 60));
                const tsecs = Math.floor((n % (1000 * 60)) / 1000);
                if (n < 1000){
                    console.log(this.state.test);
                    this.setState({
                        message: 'Time ran out!',
                        test: 0
                    });
                    clearInterval(this.intervalID);
                }
                console.log(tmins + "m " + tsecs + "s ");
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