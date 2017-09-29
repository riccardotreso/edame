var pathAnalizer = require('./server/pathanalizer');
var readline = require('readline');

console.log('\x1b[36m%s\x1b[0m', 'Copy file from source to destination, based on last modified date');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Type source path ', (sourcePath) => {
    rl.question('Type destination path ', (destinationPath) => {
        rl.question('Type due date yyyy-mm-dd ', (dueDate) => {
            console.log(new Date(dueDate));
            pathAnalizer.analizePath(sourcePath, destinationPath, new Date(dueDate));
            rl.close();
        });
    });
});




