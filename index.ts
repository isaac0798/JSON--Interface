import * as fs from 'fs';
import basicJson from './JSONs/basic.json'


for (const [key, value] of Object.entries(basicJson)) {
    console.log(`${key}: ${value}`);
}

fs.writeFile('./output.ts', "hello", (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('dub')
});
