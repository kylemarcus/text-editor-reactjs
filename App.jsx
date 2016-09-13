import React from 'react';

class App extends React.Component {

    constructor() {

        super();
        this.state = {
            line: "test"
        };

    }

    changeLine(line) {
        this.setState({line});  // ES6
    }

    render() {

        return (
           <div>
              <Header />
              <TextEditor changeLine={this.changeLine.bind(this)} />
              <Footer line={this.state.line} />
           </div>
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

    indexAtStartOfLine(text, startIndex) {

        let endIndex = startIndex;

        while (startIndex >= 0) {
            if (startIndex == endIndex && text[startIndex] == '\n') startIndex--;
            if (text[startIndex] != '\n') {
                startIndex--;
            } else {
                break;
            }
        }

        return startIndex;
    }

    indexAtEndOfLine(text, endIndex) {

        while (endIndex <= text.length) {
            if (text[endIndex] != '\n') {
                endIndex++;
            } else {
                break;
            }
        }

        return endIndex;

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