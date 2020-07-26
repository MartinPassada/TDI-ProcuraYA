import React from 'react'
import Lottie from 'react-lottie';

export default class LottieConstructor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isStopped: false, isPaused: false };
    }

    render() {
        const defaultOptions = {
            loop: this.props.loop,
            autoplay: this.props.autoplay,
            animationData: this.props.animation,
            renderer: "svg", // "canvas", "html"
        };

        return (
            <>
                {/* <div onMouseOver={() => { this.setState({ isStopped: false }) }} onMouseOut={() => this.setState({ isStopped: true })}>  */}
                <div onMouseOver={() => { this.setState({ isStopped: false }) }} onMouseOut={() => this.setState({ isStopped: true })}>
                    <Lottie options={defaultOptions}
                        height={this.props.h}
                        width={this.props.w}
                        isStopped={this.state.isStopped}
                        isPaused={this.state.isPaused} />
                </div >
            </>
        )
    }
}