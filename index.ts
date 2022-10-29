import * as fs from 'fs';
import basicJson from './JSONs/basic.json'

interface test {
    data: string
}

let outputData: string = ''
let outputObject = {};

for (const [key, value] of Object.entries(basicJson)) {
    console.log(`${key}: ${value}`);
    const valType = typeof value;
    outputData = `${key}: ${valType}`;
}

const indentString = (str: string, count: number, indent = ' ') =>
  str.replace(/^/gm, indent.repeat(count));
 
const removeString = (str: string): string => {
    return str.replace(/['"]+/g, '')
}

const baseInterfaceString = 'interface root {' + '\n' + removeString(indentString(JSON.stringify(outputData),2)) + '\n' + '}';
const buffer = Buffer.from(baseInterfaceString, 'utf-8');
//const buffertest = Buffer.from(JSON.stringify(test));

fs.writeFile('./output.ts', buffer, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('dub')
});
