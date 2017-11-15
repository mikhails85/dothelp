const https = require('https');
const { prompt } = require('inquirer');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const CLI = require('clui');
const clc = require('cli-color');

let currentIndex = 0;
let  currentResults = {};

const questions = [{
  name: 'show',
  message: chalk.blue('Do you want me to show next result ?'),
  type: 'list',
  default: 'yes',
  choices: ['yes', 'no'],
  filter: function (str){
     return str.toLowerCase();
  }
}]

const searchApi = function(query){
        if(!query)
        {
            return;
        }
        
        https.get('https://docs.microsoft.com/api/apibrowser/dotnet/search?api-version=0.2&search='+query+'&$filter=monikers/any(t:%20t%20eq%20%27netcore-2.0%27)', (resp) => {
              let data = '';
             
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                currentResults = JSON.parse(data).results;
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
            .column(currentResults[index].displayName)
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .column('Kind', 20, [clc.cyan])
            .column(currentResults[index].itemKind)
            .fill()
            .store();
            
            line = new Line(outputBuffer)
            .column('Link', 20, [clc.cyan])
            .column(currentResults[index].url,1000,[clc.blue])
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
            });
        }
    }

module.exports = class ref {
    search(query){ searchApi(query);}
}