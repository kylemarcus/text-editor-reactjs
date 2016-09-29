export const selectFile = (file) => {
	if (!file.buffer) {
        // set the file buffer
		file.buffer = file.data;
	}
    return {
        type: 'FILE_SELECTED',
        payload: file
    }
};

export const fileChanged = (file, buffer) => {
    // save the buffer
	file.buffer = buffer;
    return {
        type: 'FILE_CHANGED',
        payload: file
    }
};

export const addNewFile = (filename) => {
    return {
        type: 'ADD_NEW_FILE',
        payload: filename
    }
};

export const deleteFile = (fileId) => {
    return {
        type: 'DELETE_FILE',
        payload: fileId
    }
};