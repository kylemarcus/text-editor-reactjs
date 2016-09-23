//TODO: maybe put this logic back in so that the reducer-files
//      can update its store when FILE_CHANGED or FILE_SELECTED

export const selectFile = (file) => {
	/*if (!file.buffer || file.buffer != file.data) {
		file.buffer = file.data;
	}*/
    return {
        type: 'FILE_SELECTED',
        payload: file
    }
};

export const fileChanged = (file, buffer) => {
	//file.buffer = buffer;
    return {
        type: 'FILE_CHANGED',
        payload: {file, buffer}
    }
};