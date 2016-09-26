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
            state = state.map((file)=> {
                if( file.id == action.payload.id ) {
                    return action.payload
                } else {
                    return file;
                }
            });
            console.log("<REDUCER> [reducer-files] FILE_CHANGED\n\tpayload: " + JSON.stringify(action.payload) + "\n\treturned state: " + JSON.stringify(state));
            break;
        case "ADD_NEW_FILE":
            console.log("<REDUCER> [reducer-files] ADD_NEW_FILE");
            let nextId = Math.max.apply(Math,state.map(function(file){return file.id;})) + 1;
            let newFile = {
                id: nextId,
                filename: action.payload,
                data: "",
                buffer: null
            }
            state.push(newFile);
            break;
        case "DELETE_FILE":
            console.log("<REDUCER> [reducer-files] DELETE_FILE");
            state = state.filter((file) => {
                return file.id != action.payload;
            });
            break;
    }
    return state;
}