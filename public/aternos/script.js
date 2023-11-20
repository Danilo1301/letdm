$("#start").click(e => {
    startServer();
})

function startServer()
{
    setButtonEnabled(false);

    $.post('/api/aternos/start', (response) => {
        console.log("response");

        requestStatus();
    });
}

function setButtonEnabled(enabled)
{
    $("#start").prop("disabled", !enabled)
    

    if(enabled) {
        $("#start").removeClass("btn-dark");
        $("#start").addClass("btn-primary")
        $("#start").text("Ligar servidor");

    } else {
        $("#start").addClass("btn-dark")
        $("#start").removeClass("btn-primary")
        $("#start").text("-");
    }
}

function loop()
{
    requestStatus();
}

function requestStatus()
{
    $.get('/api/aternos/status', (data) => {
        console.log("data", data);

        updateStatus(data.status);

        $("#console").text(`${data.consoleMessage}`);
        $("#time").text(`${data.timeLeft}`);
    });
}

function updateStatus(status)
{
    console.log("status", status);

    setButtonEnabled(false);

    $("#status").addClass("text-bg-light");
    $("#status").removeClass("text-bg-success");


    if(status == 0)
    {
        $("#status").text(`Desligado`);
        setButtonEnabled(true)
    }

    if(status == 1)
    {
        $("#status").text(`Aguarde... Ligando servidor...`)
    }

    if(status == 2)
    {
        $("#status").html(`Aguarde...<br>(Pode demorar alguns minutos)`)
    }

    if(status == 3)
    {
        $("#status").text(`Ligado!`)

        $("#status").removeClass("text-bg-light");
        $("#status").addClass("text-bg-success");
    }
}

function main(_GM)
{
    requestStatus();

    setInterval(() => loop(), 2000);
}
main();
