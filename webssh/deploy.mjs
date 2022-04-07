import * as fs from 'fs';
import * as fsPromise from 'fs/promises';
import * as childProcess from 'child_process';

console.log(fs.chmod);
const websshPath = 'C:\\Users\\lenovo\\XBB\\UI\\smartcmp-ui\\static\\webssh';
if (fs.existsSync(websshPath)) {
    fsPromise.rmdir(websshPath, {recursive: true});
    childProcess.exec('cp -ruv ./webssh C:\\Users/\\lenovo/\\XBB\\UI\\smartcmp-ui\\static\\', (error, stdout, stderr) =>　{
        console.log(error, stdout, stderr);
    })
}  else {
    process.exit(0);
}