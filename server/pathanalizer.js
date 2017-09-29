var fs = require('fs'),
    path_modules = require('path');


var PathAnalyzer = function(){
    var self = this;
    var _sourcePath = null, _destinationPath = null, _dueDate = null;

    self.analizePath = function(path, destinationPath, dueDate) {
        if(_sourcePath === null &&  _destinationPath === null && _dueDate === null){
            //First loop
            _sourcePath = path;
            _destinationPath = destinationPath;
            _dueDate = dueDate;
            //controllo e pulizia della folder
            if(fs.existsSync(_destinationPath)){
                deleteFolderRecursive(_destinationPath);
            }
            fs.mkdirSync(_destinationPath);

        }

        var stat = fs.lstatSync(path);
    
        if (stat.isDirectory()) {
            // we have a directory: do a tree walk
            var files = fs.readdirSync(path);
            var f, l = files.length;
            for (var i = 0; i < l; i++) {
                f = path_modules.join(path, files[i]);
                self.analizePath(f);
            }
        } else {
            if(stat.mtime > _dueDate)
            {
                controlFolder(path, _sourcePath, _destinationPath);
            }
        }
    };

    function controlFolder(filePath, sourcePath, destinationPath){
        var strCleanPath = path_modules.dirname(filePath).replace(sourcePath, ''),
            arrParentDirectory =  strCleanPath.split(path_modules.sep);
    
        arrParentDirectory.forEach(function(element) {
            if(element !== ''){
                destinationPath = path_modules.join(destinationPath, element);
                if(!fs.existsSync(destinationPath)){
                    fs.mkdirSync(destinationPath);
                }
            }
        }, this);
    
        fs.copyFileSync(filePath, path_modules.join(destinationPath, path_modules.basename(filePath)));
    }


    function deleteFolderRecursive(path) {
        if( fs.existsSync(path) ) {
          fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
    };
}


module.exports = new PathAnalyzer();