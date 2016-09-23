export default function (state = "", action) {
    switch (action.type) {
        case 'FILE_CHANGED':
            return action.payload;
            break;
    }
    return state;
}