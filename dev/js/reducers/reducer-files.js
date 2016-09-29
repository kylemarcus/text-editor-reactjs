export const INITIAL_STATE = 
    [
        {
            id: 1,
            filename: "hello.txt",
            data: "this is\na test",
            buffer: null
        },
        {
            id: 2,
            filename: "world.txt",
            data: "test\n\ntest!!!",
            buffer: null
        }
    ];

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case "FILE_CHANGED":
            // replace the file object when file saved
            state = state.map((file)=> {
                if( file.id == action.payload.id ) {
                    return action.payload
                } else {
                    return file;
                }
            });
            break;
        case "ADD_NEW_FILE":
            // create a new file obj and push it onto the list
            let newFile = {
                id: new Date().valueOf(),
                filename: action.payload,
                data: "",
                buffer: null
            }
            state.push(newFile);
            break;
        case "DELETE_FILE":
            // return a state without that file included
            state = state.filter((file) => {
                return file.id != action.payload;
            });
            break;
    }
    return state;
}