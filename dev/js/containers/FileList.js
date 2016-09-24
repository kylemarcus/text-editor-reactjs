import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button, FormControl, FormGroup, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import {selectFile} from '../actions/index';

class FileList extends Component {

    constructor() {
        super();
        this.state = {
            showCreateNewFileModal: false
        };
    }

	renderFileList() {
		return this.props.files.map((file) => {
			return (
				<ListGroupItem 
                    key={file.id}
                    id={file.id}
					onClick={() => this.handleFilenameClick(file.id)}
                    className={this.setActiveFile(file.id)}
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

    setActiveFile(fileId) {
        let af = this.props.activeFile;
        if (af && af.id == fileId) {
            return "active";
        } else {
            return "";
        }
    }

    toggleShowNewFileModal() {
        this.setState(
            {
                showCreateNewFileModal: !this.state.showCreateNewFileModal
            });
    }

    render() {
        return (
            <div>

                <ListGroup>
                	{this.renderFileList()}
                </ListGroup>

                <Button 
                    bsSize="large" 
                    block 
                    onClick={() => this.toggleShowNewFileModal()}
                >
                    Add a new file
                </Button>

                <Modal show={this.state.showCreateNewFileModal} onHide={() => this.toggleShowNewFileModal()}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create new file!</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                        <FormGroup>
                          <FormControl
                            type="text"
                            placeholder="File Name"
                            autoFocus={true}
                          />
                        </FormGroup>
                      </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsStyle="primary">Create</Button>
                    <Button onClick={() => this.toggleShowNewFileModal()}>Cancle</Button>
                  </Modal.Footer>
                </Modal>

            </div>
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