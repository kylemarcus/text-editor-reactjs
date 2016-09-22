import {combineReducers} from 'redux';
import FileReducer from './reducer-files';

const allReducers = combineReducers({
    files: FileReducer
});

export default allReducers;