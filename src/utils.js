const { os, fs, path, workspace, folderPath, window, commands } = require('./items');

let t = window.createTerminal({
  name: 'Make',
  hideFromUser: true
});

const terminal = async (command) => {
  
  try {

    if (t.exitStatus) t = window.createTerminal({
      name: 'Make',
      hideFromUser: true
    });

    t.show(); // Showing the terminal

    /* Clearing the terminal. */
    os.platform() === 'win32' ? t.sendText('cls') : t.sendText('clear');

    /* Sending the command to the terminal. */
    t.sendText(`${command}`);

  } catch (e) {
    window.showErrorMessage(e);
  }
}

/**
 * It checks if the project folder has the necessary subfolders and files, and if not, it creates them
 * @returns A function that creates a folder structure for a C++ project.
 */
const struct = async () => {
  
  try {

    if (!workspace) return window.showErrorMessage('Please open a project folder first');

    if (!fs.existsSync(path.join(folderPath, 'src'))){

      fs.mkdirSync(path.join(folderPath, 'src'), {recursive: true}, err => {
        if (err) {
          console.error(err)
          window.showErrorMessage('Failed to create folder')
        }
      })

    }

    if(!fs.existsSync(path.join(folderPath, 'include'))){

      fs.mkdirSync(path.join(folderPath, 'include'), {recursive: true}, err => {
        if (err) {
          console.error(err)
          window.showErrorMessage('Failed to create folder')
        }
      })
    }

    if(!fs.existsSync(path.join(folderPath, 'lib'))){

      fs.mkdirSync(path.join(folderPath, 'lib'), {recursive: true}, err => {
        if (err) {
          console.error(err)
          window.showErrorMessage('Failed to create folder')
        }
      })

    }

    if(!fs.existsSync(path.join(folderPath, 'src', 'main.cpp'))){

      fs.writeFile(path.join(folderPath, 'src', 'main.cpp'), fs.readFileSync(__dirname + `/template/main.txt`, 'utf8'), err => {
        if (err) {
          console.error(err)
          window.showErrorMessage('Failed to create file')
        }
      })
      
    } 

    if(!fs.existsSync(path.join(folderPath, 'Makefile'))){
        
      fs.writeFile(path.join(folderPath, 'Makefile'), fs.readFileSync(__dirname + `/template/makefile.txt`, 'utf8'), err => {
        if (err) {
          console.log(err)
          window.showErrorMessage('Failed to create file');
        }
      })
    }

    if(!fs.existsSync(path.join(folderPath, '.gitignore'))){
          
        fs.writeFile(path.join(folderPath, '.gitignore'), fs.readFileSync(__dirname + `/template/gitignore.txt`, 'utf8'), err => {
          if (err) {
            console.log(err)
            window.showErrorMessage('Failed to create file');
          }
        })
    }

  } catch (e) {
    console.log('An error occurred.', e);
  }

}

/**
 * It checks if the bin folder exists, if it does, it checks if there's a file in it, if there is, it
 * clears the terminal and runs the make run command.
 * @returns the result of the ternary operator.
 */
const run = async () => {

  try {

    
    if (!fs.existsSync(path.join(folderPath, 'bin'))) return window.showErrorMessage('No such file or directory');
    
    let file = fs.readdirSync(`${folderPath}/bin`);
    
    if(!`${file}`) return window.showErrorMessage('No such file or directory');
    
    terminal('make run');

  } catch (e) {
    console.log('An error occurred.', e);
  }

}

/**
 * It checks if the src folder exists, if it does, it checks if there are any files in the src folder,
 * if there are, it clears the terminal and runs the make command
 * @returns the result of the fs.readdirSync() method.
 */
const build = async () => {

  try {

    if (!fs.existsSync(path.join(folderPath, 'src'))) return window.showErrorMessage('No such file or directory');

   let file = fs.readdirSync(`${folderPath}/src`);

    if(!`${file}`) return window.showErrorMessage('No such file or directory');

    terminal('make');


  } catch (e) {
    console.log('An error occurred.', e);
  }

}

/**
 * It clears the terminal and then sends the command `make clean` to the terminal
 */
const clean = async () => {

  try {

    terminal('make clean');
    
  } catch (e) {
    console.log('An error occurred.', e);
  }

}

/**
 * It clears the terminal and then sends the command `make delete` to the terminal
 */
const destroy = async () => {

  try {

    terminal('make delete');

  } catch (e) {
    console.log('An error occurred.', e);
  }

}

module.exports = {
  struct,
	run,
  build,
	clean,
	destroy,
	commands
};