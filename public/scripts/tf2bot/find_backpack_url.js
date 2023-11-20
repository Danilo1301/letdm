console.log("oi meu chapa");

inData = {
    itemName: "Toy Tailor", 
    qualityName: "Unusual", 
    unusualEffect: "Vivid Plasma", 
    craftable: true
}

async function wait(t)
{
    return new Promise((resolve) => {
        setTimeout(() => { resolve() }, t);
    });
}

async function waitForElement(el)
{
    return new Promise((resolve) => {
        console.log(`[${el}] Waiting...`)

        var interv = setInterval(() => {
            try {
                if($(el)[0] != undefined)
                {
                    clearInterval(interv);
                    console.log(`[${el}] Loaded!`)
                    resolve();
                } else {
                    console.log(`[${el}] Not loaded...`)
                }
            } catch (error) {
                console.log(`[${el}] Not loaded, ${error}`)
            }
            
        }, 10)
    })
    
}



(async () => {
    console.log("Starting!");

    await waitForElement("a[id=open-classifieds-search-modal]");

    console.log("Ok!", JSON.stringify(inData));

    
    $("a[id=open-classifieds-search-modal]").click();
    

    await waitForElement("[id=adv-search-item-search");

    $("[id=adv-search-item-search")[0].value = inData.itemName;

    //$(".panel-collapse").addClass("collapse in")






    ///await wait(500);

    //$("a:contains('General')").click();

    //await waitForElement("select[data-key=craftable]");

    $("select[data-key=craftable]")[0].value = inData.craftable ? 1 : 2;

    //await wait(500);

    //$("a:contains('Quality')").click();

    //await waitForElement("label:contains('Unique')");

    $("label:contains('" + inData.qualityName + "')").click();

    //await wait(500);
    
})()
