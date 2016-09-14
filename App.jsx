import React from 'react';
import $ from 'jquery';
import { PageHeader, Grid, Row, Col, ListGroup, ListGroupItem, Navbar } from 'react-bootstrap';

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


    render() {

        return (
           <div>
              <Header currentFile={this.state.currentFile}/>
              <Grid style={{margin: 0}}>
                <Row>
                  <Col xs={12} md={8}>
                    <TextEditor ref="textEditor" changeLine={this.changeLine.bind(this)} />
                  </Col>
                  <Col xs={6} md={4}>
                    <FileList fileDict={this.state.fileDict} 
                          changeCurrentFile={this.changeCurrentFile.bind(this)} />
                  </Col>
                </Row>
              </Grid>
              <Footer line={this.state.line} />
           </div>
        );

    }

}

class FileList extends React.Component {

    getDictKeys(dict) {
        return Object.keys(dict);
    }

    fileNameClicked(e) {
        this.props.changeCurrentFile(e.fileName);
    }

    render() {

        return (

            <ListGroup>
                {this.getDictKeys(this.props.fileDict).map(function(fileName) {
                    return <ListGroupItem onClick={this.fileNameClicked.bind(this, {fileName})}>{fileName}</ListGroupItem>
                }, this)} {/* need to bind 'this' to map in order to get access to methods in this class */}
            </ListGroup>



            
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
              <Navbar.Text>
                <h2>{this.props.line}</h2>
              </Navbar.Text>
            
          </Navbar>


            
        );

    }

}

export default App;