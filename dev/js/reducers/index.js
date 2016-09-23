import {combineReducers} from 'redux';
import FileReducer from './reducer-files';
import ActiveFileReducer from './reducer-active-file';
import FileBufferReducer from './reducer-file-buffer';

const allReducers = combineReducers({
    files: FileReducer,
    activeFile: ActiveFileReducer,
    fileBuffer: FileBufferReducer
});

export default allReducers;