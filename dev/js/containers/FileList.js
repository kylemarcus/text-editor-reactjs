import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button, FormControl, FormGroup, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import {selectFile} from '../actions/index';

class FileList extends Component {

    constructor() {
        super();
        this.state = {
            showCreateNewFileModal: false,
            showWarningModal: false,
            newFilename: null
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
                        (file) => { return file.id == fileId }
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
        this.setState({showCreateNewFileModal: !this.state.showCreateNewFileModal});
    }

    toggleShowWarningModal() {
        this.setState({showWarningModal: !this.state.showWarningModal});
    }

    handleNewFileNameChange(event) {
        this.setState({newFilename: event.target.value});
    }

    handleCreateNewFileBtnClick() {
        if (this.newFilenameAlreadyExists()) {
            this.toggleShowWarningModal();
        } else {
            console.log("new file can be created");
        }
    }

    newFilenameAlreadyExists() {
        return this.props.files.find(
            (file) => { return file.filename == this.state.newFilename }
        );
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

                <Modal 
                    show={this.state.showCreateNewFileModal} 
                    onHide={() => this.toggleShowNewFileModal()}
                >
                    <Modal.Header 
                        closeButton
                    >
                        <Modal.Title>Create new file!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    placeholder="File Name"
                                    autoFocus={true}
                                    onChange={this.handleNewFileNameChange.bind(this)}
                                />
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            bsStyle="primary" 
                            onClick={() => this.handleCreateNewFileBtnClick()}
                        >
                            Create
                        </Button>
                        <Button 
                            onClick={() => this.toggleShowNewFileModal()}
                        >
                            Cancle
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal 
                    show={this.state.showWarningModal} 
                    onHide={() => this.toggleShowWarningModal()}
                >
                    <Modal.Header 
                        closeButton
                    >
                        <Modal.Title>
                            <span 
                                className="glyphicon glyphicon-warning-sign" 
                                style={{color: 'red'}}
                            /> 
                            Warning!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            That file name is already used, please choose another name.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            bsStyle="primary" 
                            onClick={() => this.toggleShowWarningModal()}
                        >
                            Ok
                        </Button>
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