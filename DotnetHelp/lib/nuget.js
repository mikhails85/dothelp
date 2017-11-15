const https = require('https');
const { prompt } = require('inquirer');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const CLI = require('clui');
const clc = require('cli-color');

const fs = require("fs");
const pathLib = require("path");

const { exec } = require('child_process');


let currentIndex = 0;
let  currentResults = {};

const questions = [{
  name: 'show',
  message: chalk.blue('Do you want me to show next result ?'),
  type: 'list',
  default: 'yes',
  choices: ['yes', 'no', 'install'],
  filter: function (str){
     return str.toLowerCase();
  }
}]

const searchApi = function(query){
        if(!query)
        {
            return;
        }
        
        https.get('https://api-v2v3search-0.nuget.org/query?q='+query+'&prerelease=true', (resp) => {
              let data = '';
             
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                currentResults = JSON.parse(data).data;
                currentIndex = 0;
                
                if(currentResults)
                {
                    writeResult(currentIndex);
                }
              });
             
            }).on("error", (err) => {
              console.log(chalk.red("Error: " + err.message));
        });      
    }

const nextResult = function(){
        if(currentResults && (currentResults.length-1) > currentIndex)
        {
                currentIndex++;
                writeResult(currentIndex);
        }
    }     

const writeResult = function(index){
        if(currentResults && currentResults[index])
        {
            clear()
            
            let Line          = CLI.Line;
            let LineBuffer    = CLI.LineBuffer;
            
            let outputBuffer = new LineBuffer({
              x: 0,
              y: 0,
              width: 'console',
              height: 'console'
            });
            
            let line = new Line(outputBuffer)
            .column('Name', 20, [clc.cyan])
            .column(currentResults[index].id)
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .column('Summary', 20, [clc.cyan])
            .column(currentResults[index].summary)
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .column('Link', 20, [clc.cyan])
            .column(currentResults[index].projectUrl,1000,[clc.blue])
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .column('Current result', 20, [clc.green])
            .column(''+(currentIndex+1), 20)
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .column('Found results', 20, [clc.green])
            .column(''+currentResults.length, 20)
            .fill()
            .store();
            
            outputBuffer.output();
            
            console.log("");
            
            prompt(questions).then((answers) => {
                if(answers.show ==='yes')
                {
                    nextResult(answers);
                }
                if(answers.show ==='install')
                {
                    installNuget(currentResults[index].id);
                }
            });
        }
    }

const installNuget = function(id)
{
    var rootPath = getRootPath(process.cwd());
    if(!rootPath)
    {
        console.log(chalk.red("Error: folder with proj or sln file not found in this path:"+process.cwd()));
        return;
    }
    
    console.log(chalk.blue("Root path:"+rootPath));
    
    var command = "cd "+rootPath+" && dotnet add package "+id;
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
        
        files = files.filter(file => pathLib.extname(file) =='.csproj');
        
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

module.exports = class nuget {
    search(query){ searchApi(query);}
}