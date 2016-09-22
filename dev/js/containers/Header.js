import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {PageHeader} from 'react-bootstrap';

class Header extends Component {
    render() {
        return (
            <PageHeader style={{padding: '0px 0px 0px 10px'}}>
                Welcome to the ReactJS text editor! 
            </PageHeader>
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.files
    };
}

export default connect(mapStateToProps)(Header);