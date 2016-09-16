import React from 'react';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import { PageHeader, Grid, Row, Col, ListGroup, ListGroupItem, Navbar, Button, Alert, Collapse, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class App extends React.Component {

    constructor() {

        super();
        this.state = {
            line: "",
            fileDict: {},
            currentFile: "",
            fileChanged: false,
            fileNameSaved: ""
        };

    }

    componentDidMount() {
        
        this.serverRequest = $.ajax({
            url: './data.json',
            dataType: 'json',
            cache: false,

            success: function(data) {
                let file = Object.keys(data)[0];
                this.setState({fileDict: data});
                this.changeCurrentFile(file);
            }.bind(this),

            error: function(xhr, status, err) {
                console.error('./data.json', status, err.toString());
            }.bind(this)
        });

    }

    changeLine(line) {
        this.setState({line});  // ES6 'line: line'
        this.checkIfFileChanged();
    }

    checkIfFileChanged() {
        if (this.refs.textEditor.getTextAreaText() != this.state.fileDict[this.state.currentFile]) {
            this.setState({fileChanged: true});
        }
    }

    changeCurrentFile(fileName) {
        this.resetFileState(fileName);
        this.refs.textEditor.setNewText(this.state.fileDict[fileName]);
        this.refs.textEditor.enableTextArea();
    }

    saveFile(fileName) {
        let newTextToSave = this.refs.textEditor.getTextAreaText();
        this.state.fileDict[fileName] = newTextToSave;
        this.setState({fileNameSaved: fileName})

        this.refs.fileList.setSavedFile(true);
        setTimeout((function() { this.refs.fileList.setSavedFile(false); }).bind(this), 3000);

        // TODO: send this new file to the server
    }

    deleteFile(fileName) {

        // TODO: what happens if the delted file is the current file?
        if (this.state.currentFile == fileName) {
            this.refs.textEditor.disableTextArea();
            this.resetFileState("");
            this.refs.textEditor.setNewText("");
        }

        delete this.state.fileDict[fileName];

        this.refs.fileList.setDeletedFile(true, fileName);
        setTimeout((function() { this.refs.fileList.setDeletedFile(false); }).bind(this), 3000);

        

        // TODO: tell the server to delete the file
    }

    newFile(fileName) {
        this.state.fileDict[fileName] = "";
        this.resetFileState(fileName);
        this.refs.textEditor.setNewText(this.state.fileDict[fileName]);
        this.refs.textEditor.enableTextArea();

        // TODO: tell the server to create new file
    }

    resetFileState(currentFile) {
        this.setState({currentFile, line: "", fileChanged: false});
    }

    render() {

        return (
           <div>
              <Header currentFile={this.state.currentFile}/>
              <Grid>
                <Row>
                  <Col xs={12} md={8}>
                    <TextEditor ref="textEditor" changeLine={this.changeLine.bind(this)} />
                  </Col>
                  <Col xs={6} md={4}>
                    <FileList fileDict={this.state.fileDict} 
                          changeCurrentFile={this.changeCurrentFile.bind(this)}
                          currentFile={this.state.currentFile}
                          saveFile={this.saveFile.bind(this)}
                          deleteFile={this.deleteFile.bind(this)}
                          newFile={this.newFile.bind(this)}
                          fileChanged={this.state.fileChanged}
                          fileNameSaved={this.state.fileNameSaved}
                          ref="fileList" />
                  </Col>
                </Row>
              </Grid>
              <Footer line={this.state.line} />
           </div>
        );

    }

}

class FileList extends React.Component {

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
            deleteClickedOnCurrentFile: false
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
        this.props.changeCurrentFile(this.state.fileToSwitchTo);
        this.closeSaveCurrentFileModal();
    }

    saveCurrentFileChangesAndChangeFiles() {
        this.props.saveFile(this.props.currentFile);
        this.props.changeCurrentFile(this.state.fileToSwitchTo);
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
        this.props.newFile(newFileName);
        this.closeCreateNewFileModal();
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

            </div>
        );

    }

}

class Header extends React.Component {

    render() {

        return (
            <PageHeader style={{padding: '0px 0px 0px 10px'}}>Welcome to the ReactJS text editor! 
                <small>{this.props.currentFile.length > 0  
                    ? <span> Currently editing <strong>{this.props.currentFile}</strong></span>
                    : ' Choose a file to edit.'}
                </small>
            </PageHeader>
        );

    }

}

class TextEditor extends React.Component {

    indexAtStartOfLine(text, index) {

        for (var i = index; i > 0; i--) {
            if (text[i-1] == '\n') break;
        }

        return i;

    }

    indexAtEndOfLine(text, index) {

        for (var i = index; i < text.length; i++) {
            if (text[i+1] == '\n' || text[i] == '\n') break;
        }

        return i+1;

    }

    getLineAtCursorLocation(text, cursorIndex) {

        let start = this.indexAtStartOfLine(text, cursorIndex);
        let end = this.indexAtEndOfLine(text, cursorIndex);

        return text.substring(start, end);

    }

    handleChange(e) {

        let cursorIndex = this.refs.textEditorTextArea.selectionStart;
        let text = e.target.value;

        this.props.changeLine(this.getLineAtCursorLocation(text, cursorIndex));

    }

    setNewText(text) {
        this.refs.textEditorTextArea.value = text;
    }

    getTextAreaText() {
        return this.refs.textEditorTextArea.value;
    }

    disableTextArea() {
        this.refs.textEditorTextArea.disabled = true;
    }

    enableTextArea() {
        this.refs.textEditorTextArea.disabled = false;
    }

    render() {

        return (
            <textarea ref="textEditorTextArea" 
                      rows="40"
                      style={{minWidth: '100%'}}
                      onKeyUp={this.handleChange.bind(this)} 
                      onMouseUp={this.handleChange.bind(this)}/>
        );

    }
}

class Footer extends React.Component {

    render() {

        return (

            <Navbar fixedBottom>
              <Navbar.Brand>
                {this.props.line}
              </Navbar.Brand>
            </Navbar>

        );

    }

}

export default App;