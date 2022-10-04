const { struct, run, build, clean, destroy, commands } = require('./src/utils');

/**
 * It registers the commands that are defined in the `package.json` file
 * @param context - This is the context of the extension.
 */
const activate = (context) =>{

	context.subscriptions.push(commands.registerCommand('code-make-create.run', struct));
	context.subscriptions.push(commands.registerCommand('code-make-build.run', build));
	context.subscriptions.push(commands.registerCommand('code-make.run', run));
	context.subscriptions.push(commands.registerCommand('code-make-clean.run', clean));
	context.subscriptions.push(commands.registerCommand('code-make-destroy.run', destroy));
	
};

/**
 * A function declaration. It is a function that is named deactivate. It does not take any parameters.
 * It does not return anything.
 */
const deactivate = () => {

}

exports.activate = activate;

exports.deactivate = deactivate;