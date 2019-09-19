import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import shouldComponentUpdate from '@extension/shouldComponentUpdate';
import GradationButton from '@elements/GradationButton';
import GradationIconButton from '@elements/GradationIconButton';
import {
    breakpointXs,
    breakpointSm,
    breakpointFm,
    breakpointMd,
    breakpointLg,
    breakpointXl,
    breakpointXxl,
    getWindowSize,
} from '@network/window';

class ResponsibleGradationButton extends React.Component {
    static propTypes = {
        breakXs: PropTypes.bool,
        breakSm: PropTypes.bool,
        breakFm: PropTypes.bool,
        breakMd: PropTypes.bool,
        breakLg: PropTypes.bool,
        breakXl: PropTypes.bool,
        breakXxl: PropTypes.bool,
        defaultIcon: PropTypes.bool,
    };

    static defaultProps = {
        breakXs: false,
        breakSm: false,
        breakFm: false,
        breakMd: false,
        breakLg: false,
        breakXl: false,
        breakXxl: false,
        defaultIcon: false,
    };

    state = {
        xs: false,
        sm: false,
        fm: false,
        md: false,
        lg: false,
        xl: false,
        xxl: false,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(
            this,
            'ResponsibleGradationButton'
        );
        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        var size = getWindowSize();
        const {
            breakXs,
            breakSm,
            breakFm,
            breakMd,
            breakLg,
            breakXl,
            breakXxl,
            defaultIcon,
        } = this.props;

        switch (true) {
            case size.width >= breakpointXs:
                this.setState({
                    xs: false,
                });
            case size.width >= breakpointSm:
                this.setState({
                    sm: false,
                });
            case size.width >= breakpointFm:
                this.setState({
                    fm: false,
                });
            case size.width >= breakpointMd:
                this.setState({
                    md: false,
                });
            case size.width >= breakpointLg:
                this.setState({
                    lg: false,
                });
            case size.width >= breakpointXl:
                this.setState({
                    xl: false,
                });
            case size.width >= breakpointXxl:
                this.setState({
                    xxl: false,
                });
            case size.width < breakpointXs:
                this.setState({
                    xs: true,
                });
            case size.width < breakpointSm:
                this.setState({
                    sm: true,
                });
            case size.width < breakpointFm:
                this.setState({
                    fm: true,
                });
            case size.width < breakpointMd:
                this.setState({
                    md: true,
                });
            case size.width < breakpointLg:
                this.setState({
                    lg: true,
                });
            case size.width < breakpointXl:
                this.setState({
                    xl: true,
                });
            case size.width < breakpointXxl:
                this.setState({
                    xxl: true,
                });
        }
    }

    componentWillMount() {
        this.handleResize();
        if (process.env.BROWSER)
            window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        if (process.env.BROWSER)
            window.removeEventListener('resize', this.handleResize);
    }

    render() {
        const {
            breakXs,
            breakSm,
            breakFm,
            breakMd,
            breakLg,
            breakXl,
            breakXxl,
            defaultIcon,
        } = this.props;

        const { xs, sm, fm, md, lg, xl, xxl } = this.state;

        let breaking =
            xs == breakXs ||
            sm == breakSm ||
            fm == breakFm ||
            md == breakMd ||
            lg == breakLg ||
            xl == breakXl ||
            xxl == breakXxl;

        breaking = defaultIcon ? !breaking : breaking;

        const button = breaking ? (
            <GradationIconButton {...this.props} />
        ) : (
            <GradationButton {...this.props} />
        );

        return <div className="responsible-gradation-button">{button}</div>;
    }
}

export default connect(
    (state, props) => {
        return {};
    },

    dispatch => ({})
)(ResponsibleGradationButton);
