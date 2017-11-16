#!/usr/bin/env node

"use strict";

const program = require('commander');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const CLI = require('clui');


const ref = require("./lib/ref");
const nuget = require("./lib/nuget");
const dotnet = require("./lib/dotnet");
const git = require("./lib/git");

program
  .version('0.0.1')
  .description(chalk.green('.Net Api Ref Helper (')
                    +chalk.blue('https://docs.microsoft.com/en-us/dotnet/api/index?view=netcore-2.0')
                    +chalk.green(')'));

program
  .command('search <query>')
  .alias('s')
  .description('Search Api Reference')
  .action((query) => {
    clear();  
    let handler = new ref();
    handler.search(query);
  });

program
  .command('nuget <query>')
  .alias('ns')
  .description('Search in Nuget.org')
  .action((query) => {
    clear();  
    let handler = new nuget();
    handler.search(query);
  });

program
  .command('type <name>')
  .alias('t')
  .description('Create C# type')
  .action((name) => {
    clear();  
    let handler = new dotnet();
    handler.createType(name);
  });

program
  .command('git-commit')
  .alias('commit')
  .description('Git commit command')
  .action((name) => {
    clear();  
    let handler = new git();
    handler.doCommite();
  });

program
  .command('git-push')
  .alias('push')
  .description('Git push command')
  .action((name) => {
    clear();  
    let handler = new git();
    handler.doPush();
  });

program
  .command('git-pull')
  .alias('pull')
  .description('Git pull command')
  .action((name) => {
    clear();  
    let handler = new git();
    handler.doPull();
  });

program
  .command('git-sync')
  .alias('sync')
  .description('Git sync command')
  .action((name) => {
    clear();  
    let handler = new git();
    handler.doSync();
  });

if (!process.argv.slice(2).length) {
    clear();
    console.log(
      chalk.green(
        figlet.textSync('dot Help', { horizontalLayout: 'full' })
      )
    );
    program.outputHelp();
    process.exit();
}

program.parse(process.argv);