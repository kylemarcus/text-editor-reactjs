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
    handleChange(e) {
        let start = this.refs.textEditorTextArea.selectionStart;
        let end = start;
        let text = e.target.value;
        while (start >= 0) {
            if (start == end && text[start] == '\n') start--;
            if (text[start] != '\n') {
                start--;
            } else {
                break;
            }
        }
        while (end <= text.length) {
            if (text[end] != '\n') {
                end++;
            } else {
                break;
            }
        }

        this.props.changeLine(text.substring(start, end));
    }
    render() {
        return (
            <textarea ref="textEditorTextArea" rows="50" cols="150" onKeyUp={this.handleChange.bind(this)} onMouseUp={this.handleChange.bind(this)} />
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