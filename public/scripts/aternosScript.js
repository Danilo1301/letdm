/*
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://aternos.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aternos.org
// @grant        GM.xmlHttpRequest
// ==/UserScript==


var script = document.createElement('script');
script.onload = function () {
    main(GM)
};
script.src = 'http://localhost:3000/aternosScript.js';
document.head.appendChild(script);
*/

//const SERVER_URL = `http://localhost:3000`;
const SERVER_URL = `https://dmdassc.glitch.me`;

let GM;

const STATUS = {
    OFF: 0,
    STARTING: 1,
    ON: 2,
    STOPPING: 3
}

console.log(`SERVER_URL: ${SERVER_URL}`);

function main(_GM)
{
    GM = _GM;

    console.log("main", GM)

    setInterval(() => loop(), 2000);
}

function loop()
{
    console.log("loop");

    checkAlertPopup();

    console.log(`console=(${getConsoleMessage()})`);
    console.log("status=", getStatus());

    postStatus();
}


function postStatus()
{
    const data = {
        status: getStatus(),
        console: getConsoleMessage(),
        time: getTimeLeft()
    }

    console.log("postStatus", data);

    try {
        GM.xmlHttpRequest({
            method: "POST",
            url: SERVER_URL + "/api/aternos/clientData",
            data: JSON.stringify(data),
            headers:  {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                const data = JSON.parse(response.response)

                console.log(data);

                if(data.start)
                {
                    console.log("Trying to start!")
                    startServer();
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

function checkAlertPopup()
{
    const alertVisible = $(".alert-wrapper")[0].style.display == "block";

    if(!alertVisible) return;

    console.log("alertVisible");

    $(".alert-wrapper .btn.btn-green")[0].click();
}

function startServer()
{
    if(!$(".server-actions")[0].classList.contains("offline")) {
        throw "Can't start. Server is not offline!";
    }

    $("#start")[0].click();

    console.log("starting")
}

function getConsoleMessage()
{
    return $(".status-console-text")[0].textContent;
}

function getTimeLeft()
{
    return $(".server-status-label-left").text();
}

function getStatus()
{
    const statusClassList = $(".server-status")[0].children[0].classList;

    if(statusClassList.contains("online"))
    {
        return STATUS.ON;
    }

    if(statusClassList.contains("starting"))
    {
        return STATUS.STARTING;
    }

    if(!$(".server-actions")[0].classList.contains("offline"))
    {
        return STATUS.STARTING;
    }

    return STATUS.OFF;
}

window['main'] = main;