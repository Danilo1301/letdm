// ==UserScript==
// @name         Save Watched Videos
// @version      1.0.0
// @description  Save all watched videos into a server
// @author       Danilo
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

const SERVER_URL = "https://letdm.discloud.app";

function waitForElement(element)
{
    const test = () => {
        var len = document.querySelectorAll(element).length;
        return (len > 0);
    }

    return new Promise((resolve) => {
        if(test())
        {
            resolve(document.querySelectorAll(element));
            return;
        }

        var interval = setInterval(() => {
            if(test())
            {
                clearInterval(interval);
                resolve(document.querySelectorAll(element));
                return;
            }
        }, 100)
    });
}

function findElementRecursive(elm, selector)
{
    return elm.querySelectorAll(selector);

}

const Videos = {};
let lastAmountOfVideos = 0;

async function main()
{
    console.log(`Working!`);

    console.log(`Waiting for contents...`);

    await waitForElement("#contents");

    console.log(`Found:`, contents);

    findVideos();

    setInterval(() => {
        findVideos();
    }, 1000);

}

function findVideos()
{
    const contents = document.querySelectorAll("#contents #content");
    const amount = contents.length;

    console.log(`Found ${amount} videos`);

    for(const content of contents)
    {
        try
        {
            const video = processContent(content);

            if(Videos[video.id] == undefined)
            {
                console.log(`Adding video ${video.title}`);

                Videos[video.id] = video;

                if(video.progress > 0)
                {
                    //video.markAsWatched();
                }
            }

        } catch(e)
        {
            console.error(`Error processing content: ${e}`);
        }
    }

    if(amount != lastAmountOfVideos)
    {
        lastAmountOfVideos = amount;

        console.log(`Sending videos and waiting for response to check if watched...`);

        sendRequest();
    }
}

function processContent(content)
{
    const thumb = findElementRecursive(content, "a#thumbnail")[0];

    const href = thumb.href;
    const id = href.split("?v=")[1];

    const titleEl = findElementRecursive(content, "yt-formatted-string#video-title")[0];
    const title = titleEl.textContent;

    const channel = location.href.split("/")[3];

    let progress = 0;

    const progressEl = content.querySelectorAll("#progress")[0];

    if(progressEl)
    {
        const width = content.querySelectorAll("#progress")[0].style.width;

        progress = parseInt(width.replace("%", "")) / 100;
    }

    //console.log(progress);

    const video = {
        id: id,
        title: title,
        progress: progress,
        channel: channel,

        hasReceivedData: false,

        isWatched: () => { return this.progress > 0 },

        markAsWatched: () => {
            content.style.backgroundColor = "#006e00"
            content.style.padding = "10px"
            content.style.borderRadius = "20px"
        }
    }

    //console.log(video);

    return video;
}

function sendRequest()
{
    const body = [];

    for(const key in Videos)
    {
        const video = Videos[key];

        if(!video.hasReceivedData)
        {
            video.hasReceivedData = true;

            body.push(video);
        }

    }

    const url = SERVER_URL + "/api/videos/process";

    // Enviando a solicitação POST
    fetch(url, {
        method: 'POST', // Tipo de requisição
        headers: {
            'Content-Type': 'application/json' // Define o formato como JSON
        },
        body: JSON.stringify(body) // Converte o objeto para JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        for(const key of data)
        {
            const video = Videos[key];

            video.markAsWatched();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });

    /*
    console.log(JSON.stringify(body));

    const response = ["x3ETYbJhiLg"];

    for(const key of response)
    {
        const video = Videos[key];

        video.markAsWatched();
    }
    */
}


(function() {
    main();
})();