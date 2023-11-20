console.clear()

var particles_str = `{"'72":3004,"Abduction":91,"Abyssal Aura":125,"Accursed":3024,"Aces High":59,"Acidic Bubbles of Envy":3017,"Amaranthine":82,"Ancient Codex":98,"Ancient Eldritch":105,"Anti-Freeze":69,"Apotheosis":3051,"Arachnid Assault":3047,"Arcana":73,"Arcane Assistance":3040,"Arctic Aurora":3033,"Aromatica":148,"Ascension":3052,"Astral Presence":3038,"Atomic":92,"Bee Swarm":151,"Bewitched":3023,"Blighted Snowstorm":170,"Blizzardy Storm":30,"Bonzo The All-Gnawing":81,"Brain Drain":111,"Bubbling":34,"Burning Flames":13,"Cauldron Bubbles":39,"Chiroptera Venenata":75,"Chromatica":149,"Circling Heart":19,"Circling Peace Sign":18,"Circling TF Logo":11,"Clairvoyance":121,"Cloud 9":58,"Cloudy Moon":38,"Community Sparkle":4,"Cool":703,"Creepy Crawlies":3048,"Darkblaze":79,"Dead Presidents":60,"Death at Dusk":90,"Death by Disco":100,"Defragmenting Reality":139,"Delightful Star":3049,"Demonflame":80,"Disco Beat Down":62,"Distant Dream":168,"Divine Desire":167,"Eerie Lightning":3027,"Eerie Orbiting Fire":40,"Eldritch Flame":106,"Electric Hat Protector":94,"Electrostatic":67,"Emerald Allurement":3041,"Enchanted":3025,"Energy Orb":704,"Ether Trail":103,"Ethereal Essence":129,"Festive Spirit":3035,"Fifth Dimension":122,"Flaming Lantern":37,"Flammable Bubbles of Attraction":3018,"Fountain of Delight":3005,"Fragmented Gluons":136,"Fragmented Photons":138,"Fragmented Quarks":137,"Fragmenting Reality":141,"Frisky Fireflies":152,"Frostbite":87,"Frosted Star":3050,"Frozen Fractals":164,"Frozen Icefall":135,"Galactic Codex":97,"Galactic Gateway":114,"Genteel Smoke":28,"Genus Plasmos":172,"Ghastly Ghosts":3012,"Ghastly Ghosts Jr":85,"Ghastly Grove":127,"Good-Hearted Goodies":3031,"Gourdian Angel":162,"Gravelly Ghoul":160,"Green Black Hole":71,"Green Confetti":6,"Green Energy":9,"Green Giggler":156,"Harvest Moon":45,"Haunted Ghosts":8,"Haunted Phantasm":3011,"Haunted Phantasm Jr":86,"Head of Steam":113,"Hellfire":78,"Hellish Inferno":3013,"Holy Grail":3003,"Hot":701,"Infernal Flames":3015,"Infernal Smoke":3016,"Isotope":702,"It's A Secret To Everybody":46,"It's a mystery to everyone":101,"It's a puzzle to me":102,"Jarate Shock":3029,"Kaleidoscope":155,"Kill-a-Watt":56,"Knifestorm":43,"Laugh-O-Lantern":157,"Lavender Landfall":165,"Magical Spirit":3036,"Magnetic Hat Protector":95,"Massed Flies":12,"Mega Strike":3010,"Memory Leak":65,"Menacing Miasma":124,"Miami Nights":61,"Midnight Whirlwind":3008,"Mirthful Mistletoe":175,"Misty Skull":44,"Molten Mallard":88,"Morning Glory":89,"Mystical Medley":128,"Nebula":99,"Nether Trail":104,"Nether Void":3030,"Neutron Star":107,"Nuts n' Bolts":31,"Ominous Night":3022,"Omniscient Orb":120,"Open Mind":112,"Orbiting Fire":33,"Orbiting Planets":32,"Overclocked":66,"Pale Nimbus":171,"Phosphorous":63,"Plum Prankster":158,"Poisoned Shadows":76,"Poisonous Bubbles of Regret":3019,"Power Surge":68,"Prismatica":150,"Pumpkin Party":163,"Purple Confetti":7,"Purple Energy":10,"Pyroland Daydream":145,"Pyroland Nightmare":159,"Pyrophoric Personality":3042,"Refragmenting Reality":142,"Reindoonicorn Rancher":3054,"Ring of Fire":117,"Roaring Rockets":3020,"Roboactive":72,"Scorching Flames":14,"Screaming Tiger":3006,"Searing Plasma":15,"Serenus Lumen":173,"Shimmering Lights":3056,"Showstopper":3001,"Silver Cyclone":3009,"Skill Gotten Gains":3007,"Smoking":35,"Smoldering Spirits":153,"Snowblinded":144,"Snowfallen":143,"Something Burning This Way Comes":77,"Sparkling Lights":134,"Special Snowfall":166,"Spectral Escort":3037,"Spectral Swirl":3014,"Spellbound":74,"Spellbound Aspect":3043,"Spooky Night":3021,"Stare From Beyond":83,"Starstorm Insomnia":109,"Starstorm Slumber":110,"Static Mist":3026,"Static Shock":3044,"Steaming":36,"Stormy 13th Hour":47,"Stormy Storm":29,"Subatomic":93,"Sulphurous":64,"Sunbeams":17,"Terrifying Thunder":3028,"Terror-Watt":57,"Tesla Coil":108,"The Dark Doorway":116,"The Eldritch Opening":115,"The Ooze":84,"Time Warp":70,"Toxic Terrors":3046,"Twinkling Lights":3055,"Twisted Radiance":130,"Valiant Vortex":133,"Veno Shock":3045,"Ventum Maris":174,"Verdant Vortex":132,"Verdatica":147,"Vexed Volcanics":161,"Vicious Circle":118,"Vicious Vortex":123,"Violent Wintertide":169,"Violet Vortex":131,"Vivid Plasma":16,"Voltaic Hat Protector":96,"Wandering Wisps":154,"White Lightning":119,"Wicked Wood":126,"Winter Spirit":3034,"Wintery Wisp":3032}`;

var PARTICLES = JSON.parse(particles_str);

let KILLSTREAK_LEVEL = {
    NONE: 0,
    BASIC: 1,
    SPECIALIZED: 2,
    PROFESSIONAL: 3,
}

let items = [];

var jq = document.createElement("script");

jq.onload = function() {
    var interv = setInterval(() => {
        var canLoad = false;

        try {
            if($(".inventoryItem").length > 0) canLoad = true;
        } catch (error) {
            console.log("$ is not defined, YET")
            console.log(error.toString())
        }

        if(canLoad)
        {
            clearInterval(interv);
            main();
        }

    }, 200)
}

jq.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
document.body.append(jq);



function main()
{
    console.log("Waiting for items...")

    var n = 0;
    for(var inventoryItem of $(".inventoryItem"))
    {
        var image = $(inventoryItem).find("img")[0];

        var item = {
            fullName: inventoryItem.attributes.itemname.value,
            baseName: "",
            name: inventoryItem.attributes.name.value,
            killstreak: KILLSTREAK_LEVEL.NONE,
            australium: false,
            buyPrice: image.attributes["data-tooltip"].value.split("Costs: ")[1].split("<")[0],
            quality: parseInt(inventoryItem.attributes.quality.value),
            tooltip: image.attributes["data-tooltip"].value,
            img: image.src,
            borderColor: image.style["border-color"],
            borderColorSecondary: image.style["border-left-color"],
            backgroundColor: image.style["background-color"],
            unusualEffect: "",
            unusualEffectId: -1,
            killstreaker: "",
            sheen: "",
            paint: "",
            craftable: false,
            festive: false,
            festivized: false,
            stnUrl: "",
            temporary: false,
            kitFor: ""
        }

        //item.fullName = item.fullName.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        //item.name = item.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        item.baseName = item.fullName
        item.craftable = !item.fullName.includes("Non-Craftable");
        item.festivized = item.tooltip.includes("Festivized");
        item.festive = item.name.includes("Festive");


        if(item.baseName.includes("Killstreak"))
        {

            if(item.baseName.includes("Professional Killstreak"))
            {
                item.baseName = item.baseName.replace("Professional Killstreak ", "");
                item.killstreak = KILLSTREAK_LEVEL.PROFESSIONAL
            }

            if(item.baseName.includes("Specialized Killstreak"))
            {
                item.baseName = item.baseName.replace("Specialized Killstreak ", "");
                item.killstreak = KILLSTREAK_LEVEL.SPECIALIZED
            }

            if(item.baseName.includes("Killstreak"))
            {
                item.baseName = item.baseName.replace("Killstreak ", "");
                item.killstreak = KILLSTREAK_LEVEL.BASIC
            }

            if(item.fullName.includes("Kit"))
            {
              item.kitFor = item.baseName.replace(" Kit", "").replace(" Fabricator", "");
              item.baseName = item.fullName;

              if(!item.fullName.includes("Fabricator")) item.craftable = false
            }
        }



        if(item.baseName.includes("Australium"))
        {
            var testName = "Australium " + inventoryItem.attributes.name.value;

            if(item.baseName.includes(testName)) item.australium = true;
        }

        if(item.quality == 5)
        {
            item.unusualEffect = item.fullName.toLowerCase().replace(item.name.toLowerCase(), "").replace("unusual ", "");

            if(item.unusualEffect.includes("Unusual")) item.unusualEffect = "";

            while(item.unusualEffect.endsWith(" "))
            {
                item.unusualEffect = item.unusualEffect.slice(0, item.unusualEffect.length - 1);
            }
            
            if(item.unusualEffect != "")
            {
                for (const k in PARTICLES) {
                    if(k.toLowerCase().includes(item.unusualEffect)) {
                        item.unusualEffect = k;
                        item.unusualEffectId = PARTICLES[k];
                        break;
                    }
                }

                console.log(item.unusualEffect, item.unusualEffectId)
            }

            
        }


        if(item.tooltip.includes("Sheen"))
        {
            var start = item.tooltip.indexOf("Sheen:")+7;

            item.sheen = item.tooltip.slice(start, item.tooltip.indexOf("<", start));
        }

        if(item.tooltip.includes("Killstreaker"))
        {
            var start = item.tooltip.indexOf("Killstreaker:")+14;

            item.killstreaker = item.tooltip.slice(start, item.tooltip.indexOf("<", start));
        }

        if(item.tooltip.includes("Paint"))
        {
            var start = item.tooltip.indexOf("Paint:")+7;

            item.paint = item.tooltip.slice(start, item.tooltip.indexOf("<", start));
        }


        if(item.fullName.includes("Botkiller"))
        {
          item.name = item.fullName.replace("Strange ", "");
        }


        if(item.baseName.toLowerCase() == item.fullName.toLowerCase())
        {
            item.stnUrl = 'https://stntrading.eu/item/tf2/' + item.baseName;
            item.stnUrl = item.stnUrl.replace(/ /g, "+");
            item.stnUrl = item.stnUrl.replace(/%/g, "%25");

        } else {
            item.temporary = true;
            item.stnUrl = location.href;

        }


        items.push(item);

        n++;
    }



    console.log(`Found ${items.length} items!`)

    window["outData"].items = items;
    window["exitScript"]();
}
