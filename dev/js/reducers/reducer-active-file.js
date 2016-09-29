export default function (state = null, action) {
    switch (action.type) {
        case 'FILE_SELECTED':
            return action.payload;
            break;
        case 'FILE_CHANGED':
            return action.payload;
            break;
        case 'DELETE_FILE':
            return null;
            break;
    }
    return state;
}
