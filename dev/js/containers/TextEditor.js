import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class TextEditor extends Component {
    render() {
        return (
            <textarea rows="40"
                      style={{minWidth: '100%'}} />
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.files
    };
}

export default connect(mapStateToProps)(TextEditor);