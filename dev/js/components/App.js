import React from 'react';
import Header from '../containers/Header';
import TextEditor from '../containers/TextEditor';
import FileList from '../containers/FileList';
import {Grid, Row, Col} from 'react-bootstrap';

const App = () => (
    <div>
        <Header />
        <Grid>
            <Row>
                <Col xs={12} md={8}>
                    <TextEditor />
                </Col>
                <Col xs={6} md={4}>
                    <FileList />
                </Col>
            </Row>
        </Grid>
    </div>
);

export default App;
