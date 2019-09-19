import React, { Component } from 'react';
import { Link } from 'react-router';
import * as routes from '@infrastructure/RouteInitialize';
import Img from 'react-image';

class ServerError extends Component {
    render() {
        return (
            <div
                className="float-center"
                style={{ width: '640px', textAlign: 'center' }}
            >
                <Img
                    width="64px"
                    height="64px"
                    src="/images/selfinity-mini-logo1"
                />
                <div
                    style={{
                        width: '300px',
                        position: 'relative',
                        left: '400px',
                        top: '-400px',
                        textAlign: 'left',
                    }}
                >
                    <h4>Sorry.</h4>
                    <p>Looks like something went wrong on our end.</p>
                    <p>
                        Head back to <a href="/">Selfinity</a> homepage.
                    </p>
                </div>
            </div>
        );
    }
}

export default ServerError;
