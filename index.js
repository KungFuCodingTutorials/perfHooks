// Dependencies
const performanceHooks = require('perf_hooks').performance;
const fs = require('fs/promises');
const https = require('https');
const { StringDecoder } = require('string_decoder');
const stringDecoder = require('string_decoder').StringDecoder;

// Read a file function
const readFile = async function(fileName){
    let fileData = await fs.readFile(__dirname+fileName,'utf-8');
    console.log(fileData);
}

// Fetch url functions
const bufferString = function(url,callback){
    https.get(url,function(req){
        let buffer = '';
        let decoder = new StringDecoder('utf-8');
        req.on('data',function(data){
            buffer += decoder.write(data);
        });
        req.on('end',function(){
            buffer += decoder.end();
            callback(buffer);
        })
    })
}

// View source code
const viewSource = function(url){
    bufferString(url,function(buffer){
        let str = buffer;
        console.log(str.length);
    })
}

// Create a random string

const createRandomString = function(strLength){
    if(strLength){
        let possibleCharacters = 'abcdefghiklmnopqrstuvxyzw1098765432';
        let str = '';
        for(i=1;i<=strLength;i++){
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str += randomCharacter;
        }
        return str;
    } else {
        return false;
    }
}

//Performance measurements
performanceHooks.mark('fromStart');
performanceHooks.mark('startFetchUrl');
viewSource('https://nodejs.org/dist/latest-v16.x/docs/api/');
performanceHooks.mark('finishFetchUrl');
performanceHooks.mark('startRead');
readFile('/data.json');
performanceHooks.mark('finishRead');
performanceHooks.mark('startCreateRandomString');
createRandomString(10);
performanceHooks.mark('finishCreateRandomString');
performanceHooks.mark('toFinish');

// Console log all the performance
console.log(performanceHooks.measure('readPagePerf','startRead','finishRead'));
console.log(performanceHooks.measure('fetchPerf','startFetchUrl','finishFetchUrl'));
console.log(performanceHooks.measure('createRandomString', 'startCreateRandomString','finishCreateRandomString'));
console.log(performanceHooks.measure('allProcess','fromStart','toFinish'));