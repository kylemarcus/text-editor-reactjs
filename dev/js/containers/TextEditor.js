import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fileChanged} from '../actions/index';

class TextEditor extends Component {
    handleTextChange(e) {
        this.props.fileChanged(this.props.activeFile, e.target.value);
    }

    render() {
        return (
            <textarea rows="40"
                      style={{minWidth: '100%'}}
                      value={this.props.activeFile ? this.props.activeFile.buffer : ""}
                      onChange={this.handleTextChange.bind(this)}>
        	</textarea>
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.files,
        activeFile: state.activeFile,
        fileBuffer: state.fileBuffer
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({fileChanged: fileChanged}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TextEditor);