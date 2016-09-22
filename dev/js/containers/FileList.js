import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem} from 'react-bootstrap';


class FileList extends Component {

	renderFileList() {
		return Object.keys(this.props.files).map((fileName) => {
			return (
				<ListGroupItem>
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

export default connect(mapStateToProps)(FileList);