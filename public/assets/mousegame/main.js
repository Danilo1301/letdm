const script_ts = document.createElement("script");
script_ts.src = "https://unpkg.com/typescript@latest/lib/typescriptServices.js";
document.body.appendChild(script_ts);
    
script_ts.onload = function() {
    console.log("Fetch script");
    fetch('https://dmdassc.glitch.me/assets/mousegame/script.txt', { mode: 'no-cors'}).then(x => x.text()).then((result) => {
        const tsCode = result;
        const jsCode = window['ts'].transpile(tsCode);

        console.log(result)

        console.log("Loading script", jsCode);

        eval(`window['dmdasscserverurl'] = 'https://dmdassc.glitch.me';`);
        eval(jsCode);

        
    }) 
}