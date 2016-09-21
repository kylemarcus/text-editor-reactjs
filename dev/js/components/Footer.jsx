import React from 'react';
import { Navbar } from 'react-bootstrap';

export default class Footer extends React.Component {

    render() {

        return (

            <Navbar fixedBottom>
              <Navbar.Brand>
                {this.props.line}
              </Navbar.Brand>
            </Navbar>

        );

    }

}