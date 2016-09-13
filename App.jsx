import React from 'react';
import $ from 'jquery'

class App extends React.Component {

    constructor() {

        super();
        this.state = {
            line: "test",
            fileList: ['hello', 'world'],
            data: ''
        };

    }

    componentDidMount() {
        
        this.serverRequest = $.ajax({
            url: './data.json',
            dataType: 'json',
            cache: false,

            success: function(data) {
                this.setState({data});
            }.bind(this),

            error: function(xhr, status, err) {
                console.error('./data.json', status, err.toString());
            }.bind(this)
        });

    }

    changeLine(line) {
        this.setState({line});  // ES6 'line: line'
    }

    render() {

        return (
           <div>
              <Header />
              <div>
                <TextEditor changeLine={this.changeLine.bind(this)} />
                <FileList fileList={this.state.fileList}/>
              </div>
              <Footer line={this.state.line} />
           </div>
        );

    }

}

class FileList extends React.Component {

    render() {

        return (
            <ul style={{float: 'right'}}>
                {this.props.fileList.map(function(fileName) {
                    return <li>{fileName}</li>
                })}
            </ul>
        );

    }

}

class Header extends React.Component {

    render() {

        return (
            <p>Welcome to my React text editor!</p>
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

    render() {

        return (
            <textarea ref="textEditorTextArea" 
                      rows="50" cols="150" 
                      onKeyUp={this.handleChange.bind(this)} 
                      onMouseUp={this.handleChange.bind(this)} />
        );

    }
}

class Footer extends React.Component {

    render() {

        return (
            <h1>{this.props.line}</h1>
        );

    }

}

export default App;