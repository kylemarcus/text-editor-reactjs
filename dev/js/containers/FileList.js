import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {selectFile} from '../actions/index';

class FileList extends Component {

	renderFileList() {
		return this.props.files.map((file) => {
			return (
				<ListGroupItem 
                    key={file.id}
                    id={file.id}
					onClick={() => this.handleFilenameClick(file.id)}
                    className={this.getListGroupItemClassName(file.id)}
				>
					{file.id} {file.filename} 
                </ListGroupItem>
			);
		});
	}

    handleFilenameClick(fileId) {
        console.log("<ONCLICK> [handleFilenameClick] id: " + fileId);
        if (fileId) {
            let f  = this.props.files.find(
                        (file) => {
                            return file.id == fileId;
                        }
                    );
            console.log("[handleFilenameClick] calling [selectFile] with file: " + JSON.stringify(f));
            this.props.selectFile(f);
        }
        
    }

    getListGroupItemClassName(fileId) {
        let af = this.props.activeFile;
        if (af && af.id == fileId) {
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
            selectFile: selectFile
        }, 
        dispatch
    );
}

export default connect(mapStateToProps, matchDispatchToProps)(FileList);