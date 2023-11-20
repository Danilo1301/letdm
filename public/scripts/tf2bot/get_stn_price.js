var jq = document.createElement("script");

jq.onload = function() {
    var interv = setInterval(() => {
        try {
            if($("h3.card-title")) {
                clearInterval(interv);
        
                main();
            }
        } catch (error) {
            console.log("$ is not defined, YET")
        }
        
    }, 200)
}

function main()
{
    var canSellAmount = parseInt($("div.text-center:contains('Sell it for') p")[2].textContent.split(" ")[3]);
    var inStock = parseInt($("div.text-center:contains('Buy it for') p")[2].textContent.split(" ")[0]);

    var maxStock = canSellAmount + inStock;

    var sellPrice = $("div.text-center:contains('Sell it for') p")[1].textContent;
    var buyPrice = $("div.text-center:contains('Buy it for') p")[1].textContent;

    var toRemoveStock = 0;
    for (const el of $("a.tfip-pg-bx-wrap.shadow-sm")) {

        var isKillstreak = $(el).find("div")[0].style['background-color'] == 'rgb(195, 3, 3)';

        if(isKillstreak) toRemoveStock += parseInt($(el).find("b")[0].textContent);
    }

    var stock = inStock - toRemoveStock;

    var data = {buyPrice: buyPrice, sellPrice: sellPrice, maxStock: maxStock, inStock: stock };

    console.log(data)

    window["outData"] = data;
    window["exitScript"]();
}

jq.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
document.body.append(jq);