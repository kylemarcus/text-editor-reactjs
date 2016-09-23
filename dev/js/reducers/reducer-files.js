/* TODO: need to add cases to catch when the 
 * active file changes to update this store!
 */

export default function () {
    return [
    	{
    		filename: "hello.txt",
    		data: "this is\na test",
            buffer: null
    	},
    	{
    		filename: "world.txt",
    		data: "test\n\ntest!!",
            buffer: null
    	}
    ]
}