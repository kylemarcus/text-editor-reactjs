import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {selectFile} from '../actions/index';

class FileList extends Component {

	renderFileList() {
		return Object.keys(this.props.files).map((fileName) => {
			return (
				<ListGroupItem 
					onClick={() => this.props.selectFile(fileName)}
				>
					{fileName} 
                </ListGroupItem>
			);
		});
	}

    render() {
        return (
            <ListGroup>
            	{this.renderFileList()}
            </ListGroup>
        );
    }
}

function mapStateToProps(state) {
    return {
        files: state.files
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({selectFile: selectFile}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(FileList);