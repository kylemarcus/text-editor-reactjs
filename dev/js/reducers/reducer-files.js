/* TODO: need to add cases to catch when the 
 * active file changes to update this store!
 */

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
    }
    return state;
}