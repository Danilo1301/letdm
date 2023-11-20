console.log("oi meu chapa");

var jq = document.createElement("script");

jq.onload = function() {
    var interv = setInterval(() => {
        try {
            if($("span")) {
                clearInterval(interv);
                main();
            }
        } catch (error) {
            console.log("$ is not defined, YET")
        }


        
    }, 200)
}

jq.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
document.body.append(jq);

function main()
{
    console.log("main()")

    var el = $("a:contains('backpack.tf')")[0];

    console.log($("a:contains('backpack.tf')").length)

    console.log(el[0]);

    console.log(location.href)

    if(!el)
    {
        window["outData"] = {url: undefined};
        window["exitScript"]();
        return;
    }

    var url = el.href;
    window["outData"] = {url: url};
    window["exitScript"]();


}