export const selectFile = (fileName) => {
    return {
        type: 'FILE_SELECTED',
        payload: fileName
    }
};