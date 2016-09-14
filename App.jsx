import React from 'react';
import $ from 'jquery';
import { PageHeader, Grid, Row, Col, ListGroup, ListGroupItem, Navbar, Button, Alert, Collapse } from 'react-bootstrap';

class App extends React.Component {

    constructor() {

        super();
        this.state = {
            line: "",
            fileDict: {},
            currentFile: ""
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
    }

    changeCurrentFile(fileName) {
        this.setState({currentFile: fileName, line: ""});
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
            fileNameDeleted: ""
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

    newFileClicked(e) {
        console.log("new file clicked!");
    }

    setSavedFile(saved) {
        this.setState({savedFile: saved})
    }

    setDeletedFile(deleted, fileName="") {
        this.setState({deletedFile: deleted, fileNameDeleted: fileName});
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
                                    <span onClick={this.saveClicked.bind(this, {fileName})} 
                                          className="glyphicon glyphicon-ok" 
                                          style={{float: 'right', color: 'green'}}></span>
                               </ListGroupItem>
                    }, this)} {/* need to bind 'this' to map in order to get access to methods in this class */}
                </ListGroup>

                <Button bsSize="large" block onClick={this.newFileClicked.bind(this)}>Add a new file</Button>

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