import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {selectFile, fileChanged} from '../actions/index';

class FileList extends Component {

	renderFileList() {
		return this.props.files.map((file) => {
			return (
				<ListGroupItem 
					onClick={() => this.handleFilenameClick(file)}
                    className={this.getListGroupItemClassName(file)}
				>
					{file.filename} 
                </ListGroupItem>
			);
		});
	}

    handleFilenameClick(file) {
        if (file) {
            this.props.selectFile(file);
        }
        
    }

    getListGroupItemClassName(file) {
        let af = this.props.activeFile;
        if (af && af.filename == file.filename) {
            return "active";
        } else {
            return "";
        }
    }

    render() {
        return (
            <ListGroup>
            	{this.renderFileList()}
            </ListGroup>
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.files,
        activeFile: state.activeFile
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            selectFile: selectFile, 
            fileChanged: fileChanged
        }, 
        dispatch
    );
}

export default connect(mapStateToProps, matchDispatchToProps)(FileList);