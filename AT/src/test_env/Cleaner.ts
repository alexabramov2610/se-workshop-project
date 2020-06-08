import {exec} from "child_process";




exec("/Users/rono/School/SE_Workshop/se-workshop-project/AT/dropallmac", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});