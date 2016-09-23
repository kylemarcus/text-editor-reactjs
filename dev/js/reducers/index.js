import {combineReducers} from 'redux';
import FileReducer from './reducer-files';
import ActiveFileReducer from './reducer-active-file';

const allReducers = combineReducers({
    files: FileReducer,
    activeFile: ActiveFileReducer
});

export default allReducers;