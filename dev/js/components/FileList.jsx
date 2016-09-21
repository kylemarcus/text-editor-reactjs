import React from 'react';
import ReactDOM from 'react-dom';
import { Alert, Collapse, ListGroup, ListGroupItem, Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

export default class FileList extends React.Component {

    constructor() {

        super();
        this.state = {
            savedFile: false,
            deletedFile: false,
            fileNameDeleted: "",
            showCreateNewFileModal: false,
            showSaveCurrentFileModal: false,
            fileToSwitchTo: "",
            newFileClicked: false,
            deleteClickedOnCurrentFile: false,
            showExistingFileNameWarningModal: false
        };

        this.deleteClickedOnCurrentFile = false;

    }

    getDictKeys(dict) {
        return Object.keys(dict);
    }

    fileNameClicked(e) {
        if (e.fileName != this.props.currentFile && this.props.fileChanged == true) {
            this.setState({fileToSwitchTo: e.fileName});
            this.openSaveCurrentFileModal();
        } else if (this.deleteClickedOnCurrentFile == true) {
            this.deleteClickedOnCurrentFile = false;
        } else {
            this.props.changeCurrentFile(e.fileName);
        }
    }

    discardCurrentFileChangesAndChangeFiles() {
        if (this.state.newFileClicked == false) {
            this.props.changeCurrentFile(this.state.fileToSwitchTo);
        }
        
        this.closeSaveCurrentFileModal();
    }

    saveCurrentFileChangesAndChangeFiles() {
        this.props.saveFile(this.props.currentFile);
        if (this.state.newFileClicked == false) {
            this.props.changeCurrentFile(this.state.fileToSwitchTo);
        }
        this.closeSaveCurrentFileModal();
    }

    saveClicked(e) {
        this.props.saveFile(e.fileName);
    }

    deleteClicked(e) {
        if (e.fileName == this.props.currentFile) {
            this.deleteClickedOnCurrentFile = true;
        }
        
        this.props.deleteFile(e.fileName);
    }

    newFileClicked() {
        let newFileName = ReactDOM.findDOMNode(this.refs.newFileName).value;
        if (this.props.checkIfFileCanBeCreated(newFileName)) {
            this.props.newFile(newFileName);
            this.closeCreateNewFileModal();
        } else {
            this.setState({showExistingFileNameWarningModal: true});
        }
        
    }

    setSavedFile(saved) {
        this.setState({savedFile: saved})
    }

    setDeletedFile(deleted, fileName="") {
        this.setState({deletedFile: deleted, fileNameDeleted: fileName});
    }

    closeCreateNewFileModal() {
        this.setState({ showCreateNewFileModal: false });
    }

    openCreateNewFileModal() {
        this.setState({ showCreateNewFileModal: true });
    }

    closeSaveCurrentFileModal() {
        this.setState({ showSaveCurrentFileModal: false });
        this.openNewFileModalIfNeeded();
    }

    openNewFileModalIfNeeded() {
        if (this.state.newFileClicked == true) {
            this.setState({newFileClicked: false});
            this.openCreateNewFileModal();
        }
    }

    openSaveCurrentFileModal() {
        this.setState({ showSaveCurrentFileModal: true });
    }

    addNewFileBtnClicked() {
        if (this.props.fileChanged == true) {
            this.openSaveCurrentFileModal();
            this.setState({newFileClicked: true});
        } else {
            this.openCreateNewFileModal();
        }
    }

    handleKeyPressOnSaveModal(target) {
        if (target.charCode == 13) {
            target.preventDefault();
            this.newFileClicked();
        }
    }

    closeExistingFileNameWarningModal() {
        this.setState({showExistingFileNameWarningModal: false});
    }

    render() {

        return (
            <div>
                
                <Collapse in={this.state.savedFile}>
                    <Alert ref="alert" bsStyle="success">
                        The file <strong>{this.props.fileNameSaved}</strong> was <strong>saved!</strong>
                    </Alert>
                </Collapse>

                <Collapse in={this.state.deletedFile}>
                    <Alert ref="alert" bsStyle="danger">
                        The file <strong>{this.state.fileNameDeleted}</strong> was <strong>deleted!</strong>
                    </Alert>
                </Collapse>

                <ListGroup>
                    {this.getDictKeys(this.props.fileDict).map(function(fileName) {
                        return <ListGroupItem className={this.props.currentFile == fileName ? "active" : ""} 
                                              onClick={this.fileNameClicked.bind(this, {fileName})}>{fileName} 
                                    { fileName == this.props.currentFile ?<span onClick={this.deleteClicked.bind(this, {fileName})} 
                                          className="glyphicon glyphicon-remove" 
                                          style={{float: 'right', color: 'red', marginLeft: 15}}></span> : null }
                                    { this.props.fileChanged && fileName == this.props.currentFile ? <span onClick={this.saveClicked.bind(this, {fileName})} 
                                          className="glyphicon glyphicon-save-file" 
                                          style={{float: 'right', color: 'yellow'}}></span> : null }
                               </ListGroupItem>
                    }, this)} {/* need to bind 'this' to map in order to get access to methods in this class */}
                </ListGroup>

                <Button bsSize="large" block onClick={this.addNewFileBtnClicked.bind(this) /*this.openCreateNewFileModal.bind(this)*/}>Add a new file</Button>

                <Modal show={this.state.showCreateNewFileModal} onHide={this.closeCreateNewFileModal.bind(this)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create new file!</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                        <FormGroup>
                          <FormControl
                            type="text"
                            placeholder="File Name"
                            ref="newFileName"
                            onKeyPress={this.handleKeyPressOnSaveModal.bind(this)}
                            autoFocus={true}
                          />
                        </FormGroup>
                      </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.newFileClicked.bind(this)}>Create</Button>
                    <Button onClick={this.closeCreateNewFileModal.bind(this)}>Cancle</Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={this.state.showSaveCurrentFileModal} onHide={this.closeSaveCurrentFileModal.bind(this)}>
                  <Modal.Header closeButton>
                    <Modal.Title><span className="glyphicon glyphicon-warning-sign" style={{color: 'red'}} /> Warning!</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>The file <strong>{this.props.currentFile}</strong> is un-saved.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.saveCurrentFileChangesAndChangeFiles.bind(this)}>Save Changes</Button>
                    <Button bsStyle="warning" onClick={this.discardCurrentFileChangesAndChangeFiles.bind(this)}>Discard Changes</Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={this.state.showExistingFileNameWarningModal} onHide={this.closeExistingFileNameWarningModal.bind(this)}>
                  <Modal.Header closeButton>
                    <Modal.Title><span className="glyphicon glyphicon-warning-sign" style={{color: 'red'}} /> Warning!</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>That file name is already used, please choose another name.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.closeExistingFileNameWarningModal.bind(this)}>Ok</Button>
                  </Modal.Footer>
                </Modal>

            </div>
        );

    }

}