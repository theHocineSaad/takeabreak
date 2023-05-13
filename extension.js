const vscode = require('vscode');

let interval;

/**
 * @param {vscode.ExtensionContext} context - The context object representing the state of the extension.
 */
function activate(context) {
	/**
	 * Displays the reminder message to take a break.
	 */
	function showReminder() {
		vscode.window.showWarningMessage(
			"It's time to take a break!",
			{
				modal: true,
				detail: 'Blink your eyes quickly 25 times, close and roll them around in circular motions, and look at a distant object for 20 seconds or more.'
			}
		);
	}

	/**
	 * Starts showing the reminder message every 20 seconds.
	 * @param {boolean} showNotification - Whether to show a notification when starting the reminder.
	 */
	function startShowingTheReminder(showNotification) {
		// If the reminder is already active, display a message and return.
		if (interval) {
			vscode.window.showInformationMessage("Take a break is already doing its job! You're safe.");
			return;
		}

		// Start the reminder by setting an interval to show the reminder message every 20 seconds.
		interval = setInterval(showReminder, 20 * 60 * 1000);

		// Show a notification or not, depends on "showNotification" parameter.
		showNotification ?? vscode.window.showInformationMessage("Take a break successfully started! We will notify you every 20 minutes to take a break.");
	}

	/**
	 * Stops showing the reminder message.
	 */
	function stopShowingTheReminder() {
		// If the reminder is active, stop it and display a confirmation message.
		if (interval) {
			clearInterval(interval);
			interval = undefined;
			vscode.window.showInformationMessage("Take a break is now stopped! We will not notify you to take a break. We hope you know what you're doing 😞");
		} else {
			// If the reminder is already stopped, display a message indicating that.
			vscode.window.showInformationMessage("Take a break is already stopped.");
		}
	}

	// Automatically start showing the reminder without showing a notification.
	startShowingTheReminder(false);

	// Register commands for starting and stopping the reminder.
	let startCommand = vscode.commands.registerCommand('takeabreak.Take a break: Start', () => {
		startShowingTheReminder(true);
	});

	let stopCommand = vscode.commands.registerCommand('takeabreak.Take a break: Stop', () => {
		stopShowingTheReminder();
	});

	// Add the commands to the context subscriptions.
	context.subscriptions.push(startCommand, stopCommand);
}

/**
 * This method is called when your extension is deactivated.
 */
function deactivate() {
	// If the reminder is active, stop it when the extension is deactivated.
	if (interval) {
		clearInterval(interval);
		interval = undefined;
	}
}

// Export the activate and deactivate functions for use by the extension.
module.exports = {
	activate,
	deactivate
}
