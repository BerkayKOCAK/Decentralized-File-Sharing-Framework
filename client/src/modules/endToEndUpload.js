
//const { exec , execSync} = require('child_process');
import { exec , execSync} from "child_process";
let path ;
const runScript = async ()=> 
{
    await exec(' node_modules\\electron\\dist\\electron.exe C:\\Users\\Berkay\\Desktop\\CodeLibrary\\NodeJS_Workspace\\main-test.js', (err, stdout, stderr,stdio) => {
    if (err) {
        console.log("ERRROOORR "+err);
        return;
    }
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    path = stdout;
    console.log("path "+path);

    console.log(`stderr: ${stderr}`);
    console.log(`stdio: ${stdio}`);
    })
}
runScript();

export default runScript;