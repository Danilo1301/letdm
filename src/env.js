const fs = require('fs');

module.exports = (pathJson) => {
    if(fs.existsSync(pathJson)) {
        let content = fs.readFileSync(pathJson, 'utf-8');
        let json = JSON.parse(content);

        let keys = [];

        for (const key in json) {
            if(!process.env[key])
                process.env[key] = json[key];
            keys.push(key);
        }

        console.log(`Loaded envs: ${keys.join(', ')}`)
    }
}