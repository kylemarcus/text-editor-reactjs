import React from 'react';
import { PageHeader } from 'react-bootstrap';

export default class Header extends React.Component {

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