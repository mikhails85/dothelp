const { prompt } = require('inquirer');

const chalk = require('chalk');


const CLI = require('clui');


const fs = require("fs");
const pathLib = require("path");

const { exec } = require('child_process');

const question = [{
  name: 'message',
  message: chalk.blue('comment:'),
  default: 'something done :)'
}]

const doCommite = function ()
{
    var path = getRootPath(process.cwd());
    
    console.log(chalk.blue("Root path:"+path));
    
    prompt(question).then((answers) => {
        if(answers.message)
        {
           var command = 'cd '+path+' && git add -A && git commit -m "'+answers.message+'"';
           exec(command,(error, stdout, stderr) => {
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

const doPull = function ()
{
    var path = getRootPath(process.cwd());
    
    console.log(chalk.blue("Root path:"+path));
    var command = 'cd '+path+' && git pull';
    exec(command,(error, stdout, stderr) => {
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

const doPush = function ()
{
    var path = getRootPath(process.cwd());
    
    console.log(chalk.blue("Root path:"+path));
    var command = 'cd '+path+' && git push';
    exec(command,(error, stdout, stderr) => {
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

const doSync = function ()
{
    var path = getRootPath(process.cwd());
    
    doPull(path);
    doPush(path);
}

const getRootPath = function (path)
{
     let rootPath = "";
     let foundRoot = false;
     let pathArr = path.split('/').reverse();
     let currentPath = path; 
     let tmpPath = "";
     
     pathArr.forEach(function (p) {
        
        if(!currentPath)
          return;
        
        let files =fs.readdirSync(currentPath);
        
        files = files.filter(file => pathLib.basename(file) =='.git');
        
        if(files.length > 0)
        {
          foundRoot = true;
          
        }
        
        if(foundRoot)
        {
          if(tmpPath)
          {
            tmpPath = p +'/'+ tmpPath;
          }
          else 
          {
            tmpPath = p; 
          }
        } 
        
        var lastIndex = currentPath.lastIndexOf("/");
        currentPath = currentPath.substring(0, lastIndex);
    });
    if(foundRoot)
    {
      rootPath = '/' + tmpPath;
    }
    return rootPath;
}


module.exports = class git {
    doCommite(){doCommite();}
    doPull(){doPull();}
    doPush(){doPush();}
    doSync(){doSync();}
}