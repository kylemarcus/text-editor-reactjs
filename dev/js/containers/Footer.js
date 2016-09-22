import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Navbar} from 'react-bootstrap';

class Footer extends Component {

	render() {
		return (
			<Navbar fixedBottom>
				<Navbar.Brand>
					{ this.props.files["hello.txt"] }
				</Navbar.Brand>
			</Navbar>
		);
	}
}

function mapStateToProps(state) {
    return {
        files: state.files
    };
}

export default connect(mapStateToProps)(Footer);