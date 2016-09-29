import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Alert, Button, Collapse, FormControl, FormGroup, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import {addNewFile, deleteFile, selectFile} from '../actions/index';

class FileList extends Component {

    constructor() {
        super();
        this.state = {
            showCreateNewFileModal: false,
            showFilenameWarningModal: false,
            newFilename: null,
            savedFile: false,
            deletedFile: false,
            createdNewFile: false,
            fileNameDeleted: null
        };

        // This doesn't need to be tracked so it can 
        // come out of the state.
        this.deletedActiveFile = false;
    }

    /*
     * State toggle functions
     */

    toggleShowNewFileModal() {
        this.setState({showCreateNewFileModal: !this.state.showCreateNewFileModal});
    }

    toggleShowFilenameWarningModal() {
        this.setState({showFilenameWarningModal: !this.state.showFilenameWarningModal});
    }

    toggleShowNewFileCreatedAlert() {
        this.setState({createdNewFile: !this.state.createdNewFile});
    }

    toggleShowDeletedFileAlert(filename) {
        this.setState({deletedFile: !this.state.deletedFile, fileNameDeleted: filename});
    }

    /*
     * Input handling functions
     */

    handleKeyPressOnSaveModal(target) {
        // handle what happens when the return key is pressed on the modal
        if (target.charCode == 13) {
            target.preventDefault();
            this.handleCreateNewFileBtnClick();
        }
    }

    handleNewFileNameChange(event) {
        // needed to updated the filename when it is typed in
        this.setState({newFilename: event.target.value});
    }

    handleCreateNewFileBtnClick() {
        if (this.newFilenameAlreadyExists()) {
            this.toggleShowFilenameWarningModal();
        } else {
            this.props.addNewFile(this.state.newFilename);
            this.toggleShowNewFileModal();
            this.toggleShowNewFileCreatedAlert();
            setTimeout((() => { this.toggleShowNewFileCreatedAlert(); }).bind(this), 3000);
        }
    }

    newFilenameAlreadyExists() {
        // check to see if the newFilename already exists in the file list
        return this.props.files.find(
            (file) => { return file.filename == this.state.newFilename }
        );
    }

    handleFilenameClick(fileId) {
        // When the delete button is clicked on the UI, the handler for that
        // btn is first run and then the handler for the row click is run. We
        // need to make sure to unselect file if the active file is deleted.
        if (this.deletedActiveFile == true) {
            this.deletedActiveFile = false;
        } else {
            if (fileId) {
                // find from the store the file that was clicked
                let f  = this.props.files.find(
                            (file) => { return file.id == fileId }
                         );
                this.props.selectFile(f);
            }
        }
    }

    handleFileDeleteBtnClick(fileId) {
        // Show alert and remove after 3 seconds
        this.toggleShowDeletedFileAlert(this.props.activeFile.filename);
        setTimeout((() => { this.toggleShowDeletedFileAlert(null); }).bind(this), 3000);
        // Delete the file from the store
        this.props.deleteFile(fileId);
        this.deletedActiveFile = true;
    }

    /*
     * Page rendering functions
     */

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

    renderFileList() {
        return this.props.files.map((file) => {
            return (
                <ListGroupItem 
                    key={file.id}
                    id={file.id}
                    onClick={() => this.handleFilenameClick(file.id)}
                    className={this.setActiveFileClassName(file.id)}
                >
                    {file.filename}
                { this.props.activeFile && file.id == this.props.activeFile.id ?
                <span 
                    onClick={() => this.handleFileDeleteBtnClick(file.id)}
                    className="glyphicon glyphicon-remove" 
                    style={{float: 'right', color: 'red', marginLeft: 15}}
                /> : null }
                </ListGroupItem>
            );
        });
    }

    setActiveFileClassName(fileId) {
        let af = this.props.activeFile;
        // highlights the row if current row is active
        return (af && af.id == fileId) ? "active" : "";
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

    renderFilenameWarngingModal() {
        return (
            <Modal 
                show={this.state.showFilenameWarningModal} 
                onHide={() => this.toggleShowFilenameWarningModal()}
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
                        onClick={() => this.toggleShowFilenameWarningModal()}
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

                <ListGroup>
                	{this.renderFileList()}
                </ListGroup>

                {this.renderAddNewFileBtn()}

                {this.renderCreateNewFileModal()}
                {this.renderFilenameWarngingModal()}
            </div>
        );
    }
}

/*
 * Redux mappings for state and functions
 */

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
            addNewFile: addNewFile,
            deleteFile: deleteFile
        }, 
        dispatch
    );
}

export default connect(mapStateToProps, matchDispatchToProps)(FileList);