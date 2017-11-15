const { prompt } = require('inquirer');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const CLI = require('clui');
const clc = require('cli-color');

const fs = require("fs");
const pathLib = require("path");

const { exec } = require('child_process');

let namespace ='Models';

const questions = [{
  name: 'type',
  message: chalk.blue('type:'),
  type: 'list',
  default: 'class',
  choices: ['class', 'interface', 'enum', 'struct']
},
{
  name: 'namespace',
  message: chalk.blue('namespace:'),
  default: namespace
}]

const setupNamespace = function(path){
     let pathArr = path.split('/').reverse();
     let currentPath = path; 
     let ns = "";
     let foundProj = false;
     pathArr.forEach(function (p) {
        
        if(!currentPath)
          return;
        
        let files =fs.readdirSync(currentPath);
        
        files = files.filter(file => pathLib.extname(file) =='.csproj');
        
        if(!foundProj)
        {
          if(ns)
          {
            ns = p +'.'+ ns;
          }
          else 
          {
            ns = p; 
          }
        } 
        
        if(files.length > 0)
        {
          foundProj = true;
          return;
        }
        
        var lastIndex = currentPath.lastIndexOf("/");
        currentPath = currentPath.substring(0, lastIndex);
    });
    if(foundProj)
    {
      namespace = ns;
    }
}

const createType = function(name){
    setupNamespace(process.cwd());
    
    questions[1].default = namespace;
    
    prompt(questions).then((answers) => {
        if(answers.type && answers.namespace)
        {
            //console.log('dotnet new class -o '+process.cwd()+' -t '+answers.type+' -na '+answers.namespace+' -n '+name);
            exec('dotnet new class -o '+process.cwd()+' -t '+answers.type+' -na '+answers.namespace+' -n '+name,(error, stdout, stderr) => {
              if (error) {
                console.log(chalk.red(error));
                return;
              }
              console.log(chalk.blue(stdout));
              if(stderr)
              {
                console.log(chalk.red(stderr));
                return;
              }
            });
        }
    });
}

module.exports = class dotnet {
    createType(name){ createType(name);}
}