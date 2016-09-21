import React from 'react';
import $ from 'jquery';
import { Grid, Row, Col } from 'react-bootstrap';
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import TextEditor from './TextEditor.jsx'
import FileList from './FileList.jsx'

export default class App extends React.Component {

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
            url: './data/fileData.json',
            dataType: 'json',
            cache: false,

            success: function(data) {
                this.setState({fileDict: data});
                this.resetFileState("");
                this.refs.textEditor.disableTextArea();
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

    checkIfFileCanBeCreated(newFileName) {
        return !(newFileName in this.state.fileDict);
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
                          checkIfFileCanBeCreated={this.checkIfFileCanBeCreated.bind(this)}
                          ref="fileList" />
                  </Col>
                </Row>
              </Grid>
              <Footer line={this.state.line} />
           </div>
        );

    }

}