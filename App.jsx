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
            fileChanged: false
        };

    }

    componentDidMount() {
        
        this.serverRequest = $.ajax({
            url: './data.json',
            dataType: 'json',
            cache: false,

            success: function(data) {
                this.setState({fileDict: data});
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
        this.setState({currentFile: fileName, line: "", fileChanged: false});
        this.refs.textEditor.setNewText(this.state.fileDict[fileName]);
    }

    saveFile(fileName) {
        let newTextToSave = this.refs.textEditor.getTextAreaText();
        this.state.fileDict[fileName] = newTextToSave;

        this.refs.fileList.setSavedFile(true);
        setTimeout((function() { this.refs.fileList.setSavedFile(false); }).bind(this), 3000);

        // TODO: send this new file to the server
    }

    deleteFile(fileName) {
        delete this.state.fileDict[fileName]

        this.refs.fileList.setDeletedFile(true, fileName);
        setTimeout((function() { this.refs.fileList.setDeletedFile(false); }).bind(this), 3000);

        // TODO: tell the server to delete the file
    }

    newFile(fileName) {
        this.state.fileDict[fileName] = "";
        this.setState({currentFile: fileName, line: "", fileChanged: false});
        this.refs.textEditor.setNewText(this.state.fileDict[fileName]);

        // TODO: tell the server to create new file
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
            showModal: false
        };

    }

    getDictKeys(dict) {
        return Object.keys(dict);
    }

    fileNameClicked(e) {
        this.props.changeCurrentFile(e.fileName);
    }

    saveClicked(e) {
        this.props.saveFile(e.fileName);
    }

    deleteClicked(e) {
        this.props.deleteFile(e.fileName);
    }

    newFileClicked() {
        let newFileName = ReactDOM.findDOMNode(this.refs.newFileName).value;
        this.props.newFile(newFileName);
        this.close();
    }

    setSavedFile(saved) {
        this.setState({savedFile: saved})
    }

    setDeletedFile(deleted, fileName="") {
        this.setState({deletedFile: deleted, fileNameDeleted: fileName});
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    render() {

        return (
            <div>
                
                <Collapse in={this.state.savedFile}>
                    <Alert ref="alert" bsStyle="success">
                        The file <strong>{this.props.currentFile}</strong> was <strong>saved!</strong>
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
                                    <span onClick={this.deleteClicked.bind(this, {fileName})} 
                                          className="glyphicon glyphicon-remove" 
                                          style={{float: 'right', color: 'red', marginLeft: 15}}></span> 
                                    { this.props.fileChanged && fileName == this.props.currentFile ? <span onClick={this.saveClicked.bind(this, {fileName})} 
                                          className="glyphicon glyphicon-save-file" 
                                          style={{float: 'right', color: 'yellow'}}></span> : null }
                               </ListGroupItem>
                    }, this)} {/* need to bind 'this' to map in order to get access to methods in this class */}
                </ListGroup>

                <Button bsSize="large" block onClick={this.open.bind(this) /*this.newFileClicked.bind(this)*/}>Add a new file</Button>

                <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
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
                          />
                        </FormGroup>
                      </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.newFileClicked.bind(this)}>Create</Button>
                    <Button onClick={this.close.bind(this)}>Cancle</Button>
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
                <small> Currently editing {this.props.currentFile.length > 0 
                    ? <strong>{this.props.currentFile}</strong>
                    : 'a new file.'}
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

    render() {

        return (
            <textarea ref="textEditorTextArea" 
                      rows="40"
                      style={{minWidth: '100%'}}
                      onKeyUp={this.handleChange.bind(this)} 
                      onMouseUp={this.handleChange.bind(this)} />
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