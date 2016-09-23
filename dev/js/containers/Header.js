import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {PageHeader} from 'react-bootstrap';

class Header extends Component {

    getHeaderSubText() {
        if (this.props.activeFile) {
            return (<span> Currently editing <strong>{this.props.activeFile}</strong></span>);
        } else {
            return (' Choose a file to edit.');
        }
    }

    render() {
        return (
            <PageHeader  style={{padding: '0px 0px 0px 10px'}}>
                Welcome to the ReactJS text editor! 
                <small>
                    {this.getHeaderSubText()}
                </small>
            </PageHeader>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeFile: state.activeFile
    };
}

export default connect(mapStateToProps)(Header);