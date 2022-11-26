import { exec } from "child_process";
import * as fs from "fs";
import basicJson from "./JSONs/basic.json";
import onelevel from "./JSONs/onelevel.json";
import multipleOneLevel from "./JSONs/multiple-onelevel.json";
import nested_onelevel from "./JSONs/nested_onelevel.json";

interface test {
	data: string;
}

interface interfaceObject {
    [key: string]: string
}

//TODO: Arrays

let outputObject: interfaceObject = {};

let interfaces: string[] = [];

const outputData = (data: {}, depth: number): string => {
	let outputString = "";
	let index = 0;
	const objLength = Object.keys(data).length;
	for (const [key, value] of Object.entries(data)) {
		index++;
		console.log(`${key}: ${value}`);
		const valType = typeof value;
		if (valType == "object") {
			//if final key no break line at end of obj
			interfaces.push(key.charAt(0).toUpperCase() + key.slice(1))
			if (index === objLength) {
                let line = `{\n${outputData(value as {}, depth + 1)}\n}\n`;
                outputObject[key.charAt(0).toUpperCase() + key.slice(1)] = line
				outputString += `${interfaces.pop()}`
				continue;
			}
			//if break line at end of object
            let line = `{\n${outputData(value as {}, depth + 1)}\n}\n`;
            outputObject[key.charAt(0).toUpperCase() + key.slice(1)] = line
			outputString += `${interfaces.pop()}\n`
			continue;
		}

		if (index === objLength && objLength > 1) {
			outputString += `${key}: ${valType}`;
			continue;
		}

		if (objLength === 1) {
			outputString += indentString(`${key}: ${valType}`, 2);
			continue;
		}
		outputString += indentString(`${key}: ${valType}\n`, 2);
	}

	return outputString;
};

if (!outputData) {
	process.exit();
}

const indentString = (str: string, count: number, indent = " "): string => {
	if (!str) {
		return "";
	}

	return str.replace(/^/gm, indent.repeat(count)) ?? "";
};

const removeString = (str: string): string => {
	if (!str) {
		return "";
	}

	return str.replace(/['"]+/g, "") ?? "";
};

const dataString = (str: string): string => {
	return removeString(str);
};

const out = dataString(outputData(multipleOneLevel, 1));

const baseInterfaceString =
	"interface root {" + "\n" + removeString(indentString(out, 2)) + "\n" + "}" + "\n";
const buffer = Buffer.from(baseInterfaceString, "utf-8");
console.dir(outputObject, {depth: null});
//const buffertest = Buffer.from(JSON.stringify(test));

fs.writeFile("./output.d.ts", baseInterfaceString, (err) => {
	if (err) {
		return console.log(err);
	}

    for (const [key, value] of Object.entries(outputObject)) {
        fs.appendFileSync('./output.d.ts', `interface ${key} ${value}\n`);
    }

	exec("npx rome format output.d.ts --write");
    console.log('dub');
});
