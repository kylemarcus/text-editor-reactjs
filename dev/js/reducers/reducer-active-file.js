// "state = null" is set so that we don't throw an error when app first boots up
export default function (state = null, action) {
	let f = null;
    switch (action.type) {
        case 'FILE_SELECTED':
        	f = action.payload;
        	if (!f.buffer || f.buffer != f.data) {
				f.buffer = f.data;
			}
			return f;
            //return action.payload;
            break;
        case 'FILE_CHANGED':
        	f = action.payload.file;
        	f.buffer = action.payload.buffer;
        	return f;
            //return action.payload;
            break;
    }
    return state;
}