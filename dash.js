const inquirer = require('inquirer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to ask the user for GitHub repo URL and clone the dashboard
const addDashboard = async () => {
    // Ask user for repository URL and installation directory
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'repoUrl',
            message: 'Enter the GitHub repository URL for the dashboard:',
            validate: (input) => input ? true : 'GitHub URL is required!'
        },
        {
            type: 'input',
            name: 'installDir',
            message: 'Enter the directory to install the dashboard:',
            default: './dashboard', // Default to current folder
        }
    ]);

    const { repoUrl, installDir } = answers;

    // Check if the directory already exists
    if (fs.existsSync(installDir)) {
        console.log(`Directory already exists. Proceeding to pull latest changes.`);
        // Pull the latest changes if the repo already exists
        pullLatestChanges(repoUrl, installDir);
    } else {
        // Clone the repository into the specified directory
        cloneRepo(repoUrl, installDir);
    }
};

// Function to clone the GitHub repository
const cloneRepo = (repoUrl, installDir) => {
    console.log(`Cloning the repository from ${repoUrl} into ${installDir}...`);
    
    const gitCloneCmd = `git clone ${repoUrl} ${installDir}`;

    exec(gitCloneCmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error cloning the repo: ${stderr}`);
            return;
        }
        console.log(`Dashboard successfully cloned to ${installDir}`);
        console.log(stdout);
        // Optionally, run any setup or install scripts here.
        runSetup(installDir);
    });
};

// Function to pull the latest changes from an existing repo
const pullLatestChanges = (repoUrl, installDir) => {
    console.log(`Pulling the latest changes for the repository in ${installDir}...`);
    
    const gitPullCmd = `cd ${installDir} && git pull`;

    exec(gitPullCmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error pulling the repo: ${stderr}`);
            return;
        }
        console.log(`Successfully pulled the latest changes for ${repoUrl}`);
        console.log(stdout);
        // Optionally, run any setup or install scripts here.
        runSetup(installDir);
    });
};

// Function to run any setup or installation steps after cloning/pulling
const runSetup = (installDir) => {
    console.log(`Running setup for the dashboard in ${installDir}...`);

    // Example: If the dashboard requires npm install, you can run it here:
    const npmInstallCmd = `cd ${installDir} && npm install`;

    exec(npmInstallCmd, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error during setup: ${stderr}`);
            return;
        }
        console.log(`Setup completed successfully!`);
        console.log(stdout);
    });
};

// Execute the function to add the dashboard
addDashboard();
