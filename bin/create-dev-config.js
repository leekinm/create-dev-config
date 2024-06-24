#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const abort = (e) => {
	console.log(chalk.red('\nError: "' + e.message + '"'));
	process.exit(1);
};

inquirer
	.prompt([
		{
			type: 'confirm',
			name: 'isEslint',
			message: 'Do you want to use eslint?',
		},
		{
			type: 'confirm',
			name: 'isEditor',
			message: 'Do you want to use editorconfig?',
		},
		{
			type: 'confirm',
			name: 'isPrettier',
			message: 'Do you want to use prettier?',
		},
	])
	.then((answer) => {
		console.log(answer);
		const { isEslint, isEditor, isPrettier } = answer;
		const fileAbsPaths = [];
		if (isEslint) {
			const file = {
				absPath: path.join(__dirname, '..', 'eslint.config.js'),
				data: read(path.join(__dirname, '..', 'configs/eslint.config.js')),
			};
			fileAbsPaths.push(file);
		}
		if (isEditor) {
			const file = {
				absPath: path.join(__dirname, '..', '.editorconfig'),
				data: read(path.join(__dirname, '..', 'configs/.editorconfig')),
			};
			fileAbsPaths.push(file);
		}
		if (isPrettier) {
			const file = {
				absPath: path.join(__dirname, '..', '.prettierrc.js'),
				data: read(path.join(__dirname, '..', 'configs/.prettierrc.js')),
			};
			fileAbsPaths.push(file);
		}

		fileAbsPaths.forEach(async ({ absPath, data }) => {
			if (await exist(absPath)) {
				console.log(chalk.red('File already exists!'));
			} else {
				generateFile(absPath, data);
			}
		});
		exec('npm i', (err, stdout, stderr) => {
			console.log(err);
			console.log(stdout);
			console.log(stderr);
		});
	})
	.catch(abort);

function exist(path) {
	return new Promise((resolve) => {
		fs.access(path, fs.constants.F_OK, (err) => {
			if (err) resolve(false);
			resolve(true);
		});
	});
}

function read(path) {
	return fs.readFileSync(path);
}

function generateFile(path, data) {
	fs.writeFileSync(path, data);
	console.log(chalk.green('File generated successfully!'));
}
