import * as fs from 'fs';
import basicJson from './JSONs/basic.json'
import onelevel from './JSONs/onelevel.json'
import multipleOneLevel from './JSONs/multiple-onelevel.json'

interface test {
    data: string
}

let outputObject = {};


const outputData = (data: {}): string => {
    let outputString = ''
    let index = 0
    const objLength = Object.keys(data).length
    for (const [key, value] of Object.entries(data)) {
        index++;
        console.log(`${key}: ${value}`);
        const valType = typeof value;
        if (valType == "object") {
            if (index === objLength) {
                outputString += `${key}: {\n${outputData(value as {})}\n}`
                continue;
            }
            outputString += `${key}: {\n${outputData(value as {})}\n}\n`
            continue;
        } 
        
        if (index === objLength && objLength > 1) {
            outputString += `${key}: ${valType}`;
            continue
        }

        if (objLength === 1) {
            outputString += indentString(`${key}: ${valType}`, 2);
            continue
        }
        outputString += indentString(`${key}: ${valType}\n`, 2);
    }

    return outputString
}

if (!outputData) {
    process.exit();
}

const indentString = (str: string , count: number, indent = ' '): string => {
  if (!str) {
    return ''
  }

  return str.replace(/^/gm, indent.repeat(count)) ?? ''
}
 
const removeString = (str: string): string => {
    if (!str) {
        return ''
    }

    return str.replace(/['"]+/g, '') ?? ''
}

const dataString = (str: string): string => {
    return removeString(indentString(str, 2))
}

const out = dataString(outputData(multipleOneLevel))

const baseInterfaceString = 'interface root {' + '\n' + removeString(indentString(out,2)) + '\n' + '}';
const buffer = Buffer.from(baseInterfaceString, 'utf-8');
//const buffertest = Buffer.from(JSON.stringify(test));

fs.writeFile('./output.ts',baseInterfaceString, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('dub')
});
