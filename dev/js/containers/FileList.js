import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Alert, Button, Collapse, FormControl, FormGroup, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import {selectFile, addNewFile} from '../actions/index';

class FileList extends Component {

    constructor() {
        super();
        this.state = {
            showCreateNewFileModal: false,
            showWarningModal: false,
            newFilename: null,
            savedFile: false,
            deletedFile: false,
            createdNewFile: false
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
        return (af && af.id == fileId) ? "active" : "";
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
            this.props.addNewFile(this.state.newFilename);
            this.toggleShowNewFileModal();
            this.toggleShowNewFileCreatedAlert();
            setTimeout((() => { this.toggleShowNewFileCreatedAlert(); }).bind(this), 3000);
        }
    }

    toggleShowNewFileCreatedAlert() {
        this.setState({createdNewFile: !this.state.createdNewFile});
    }

    newFilenameAlreadyExists() {
        return this.props.files.find(
            (file) => { return file.filename == this.state.newFilename }
        );
    }

    handleKeyPressOnSaveModal(target) {
        if (target.charCode == 13) {
            target.preventDefault();
            this.handleCreateNewFileBtnClick();
        }
    }

    renderCreatedNewFileAlert() {
        return (
            <Collapse in={this.state.createdNewFile}>
                <Alert bsStyle="info">
                    The file <strong>{this.state.newFilename}</strong> was <strong>created!</strong>
                </Alert>
            </Collapse>
        );
    }

    renderDeletedFileAlert() {
        return (
            <Collapse in={this.state.deletedFile}>
                <Alert bsStyle="danger">
                    The file <strong>{this.state.fileNameDeleted}</strong> was <strong>deleted!</strong>
                </Alert>
            </Collapse>
        );
    }

    renderSavedFileAlert() {
        return (
            <Collapse in={this.state.savedFile}>
                <Alert bsStyle="success">
                    The file <strong>{this.props.fileNameSaved}</strong> was <strong>saved!</strong>
                </Alert>
            </Collapse>
        );
    }

    renderAddNewFileBtn() {
        return (
            <Button 
                bsSize="large" 
                block 
                onClick={() => this.toggleShowNewFileModal()}
            >
                Add a new file
            </Button>
        );
    }

    renderCreateNewFileModal() {
        return (
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
                                onKeyPress={this.handleKeyPressOnSaveModal.bind(this)}
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
        );
    }

    renderWarngingModal() {
        return (
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
        );
    }

    render() {
        return (
            <div>
                {this.renderCreatedNewFileAlert()}
                {this.renderDeletedFileAlert()}
                {this.renderSavedFileAlert()}

                <ListGroup>
                	{this.renderFileList()}
                </ListGroup>

                {this.renderAddNewFileBtn()}

                {this.renderCreateNewFileModal()}
                {this.renderWarngingModal()}
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
            selectFile: selectFile,
            addNewFile: addNewFile
        }, 
        dispatch
    );
}

export default connect(mapStateToProps, matchDispatchToProps)(FileList);