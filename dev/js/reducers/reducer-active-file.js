// "state = null" is set so that we don't throw an error when app first boots up
export default function (state = null, action) {
    switch (action.type) {
        case 'FILE_SELECTED':
    	    console.log("<REDUCER> [reducer-active-file] FILE_SELECTED\n\treturned: " + JSON.stringify(action.payload));
			return action.payload;
            break;
        case 'FILE_CHANGED':
        	console.log("<REDUCER> [reducer-active-file] FILE_CHANGED\n\treturned: " + JSON.stringify(action.payload));
        	return action.payload;
            break;
        case 'DELETE_FILE':
            console.log("<REDUCER> [reducer-active-file] DELETE_FILE\n\treturned: null");
            return null;
            break;
    }
    return state;
}