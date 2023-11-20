/*

Works in: https://sayanything.ml/edit/permanent/

Add to input

<img id="dmdassc-load-image-2" src="https://dmdassc.glitch.me/load-gif.gif" onload="var script = document.createElement('script'); script.id = 'dmdassc-load-script-2'; script.src = 'https://dmdassc.glitch.me/scripts/sayanything-1.js'; document.head.appendChild(script);">

Then submit

*/

async function main()
{
  if(window._dmdasscAlreadyRunning) return;
  window._dmdasscAlreadyRunning = true;

  document.querySelectorAll("#dmdassc-load-image-2").forEach((s) => s.remove())
  document.querySelectorAll("#dmdassc-load-script-2").forEach((s) => s.remove())

  initNewTheme();
  initInputGayFix();
  initCheatCode();
  //initUnityGame();
  initChat();
}

function initChat()
{
  var div = document.createElement("div");
  div.id = 'chat-container'
  div.style.position = 'fixed';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.height = 'auto';

  var img = document.createElement('img');
  img.src = 'https://cms.evup.com.br/api/assets/ecommerce/eaadf1ec-f313-4a27-80da-9a5f173bb024/chat-button.png?sq=48222262-d0cf-36bc-996f-0839304e835d'
  img.style.width = '120px';
  img.onclick = function()
  {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://dmdassc.glitch.me/chat';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    div.style.height = '30%';

    img.remove();
    div.appendChild(iframe);
  }


  div.appendChild(img);

  document.body.appendChild(div);


}

function initCheatCode()
{
  class CheatCode {
    static keysHistory = [];
    static listeningCodes = [];
  
    static listenFor(code, callback)
    {
      if(!this.initialized) this.init();
    
      this.listeningCodes.push({code: code, callback: callback});
    }
  
    static init()
    {
      document.addEventListener('keydown', this.processKeyDown.bind(this));
      this.initialized = true;
    }
    
    static processKeyDown(event) {
      for(var k of this.keysHistory) {
        if(Date.now() - k.time > 8000) this.keysHistory.splice(this.keysHistory.indexOf(k), 1);
      }
    
      this.keysHistory.push({key: event.keyCode, time: Date.now()});
    
      this.checkForCodes();
    }
  
    static checkForCodes() {
      var history_code = "";
    
      for(var k of this.keysHistory) {
        history_code += k.key;
      }
    
      for(var c of this.listeningCodes) {
        var translatedCode = "";
        var codeText = c.code.toUpperCase();
        
        for(var i = 0; i < c.code.length; i++) {
          translatedCode += codeText.charCodeAt(i);
        }
    
        if(history_code.includes(translatedCode)) {
          c.callback();
          this.keysHistory = [];
        }
      }
    }
  }

  CheatCode.listenFor("meuovo", () => {
    alert("Pega nos meu ovo kkKkj");
    //location.href = "https://www.google.com/search?q=omelete";

    var bg = document.createElement("div");

    bg.style.background = "white";
    bg.style.position = "fixed";
    bg.style.top = "0px";
    bg.style.width = "100%";
    bg.style.height = "100%";
    bg.style.left = "0px";
    bg.style.transform = "translate(0, -100%)";
    bg.style.transition = "transform 0.8s";
    bg.style.background = "url('https://pm1.narvii.com/6406/49297af34825edfdff56c0209c976a4702040c83_hq.jpg')";
    bg.style["background-repeat"] = "no-repeat";
    bg.style["background-size"] = "100% 100%";
  
    document.body.append(bg);
  
    setTimeout(() => {
      bg.style.transform = "translate(0, 0)";
    }, 1);
  })
}

function initUnityGame()
{
  var div = document.createElement("div");

  div.style.position = "fixed";
  div.style.right = "5";
  div.style.bottom = "5";
  div.style.padding = "5px 20px 5px 20px";
  div.style.background = "#4e4eff";
  div.style.border = "none";

  div.innerHTML = "<h1 style='font-size: 14;'>Click to PLAY ( Multiplayer )</h1>";

  div.style.cursor = "pointer";

  document.body.appendChild(div);

  div.onclick = function() {
    div.style.display = "none";
    window.startGame();
  }

  window.startGame = function() {
    var iframe = document.createElement("iframe");
  
    iframe.src = "https://dmdassc.glitch.me/games/unity";
    iframe.style.position = "fixed";
    iframe.style.left = "50%";
    iframe.style.top = "50%";
    iframe.style.width = "1080px";
    iframe.style.height = "608px";
    iframe.style.transform = "translate(-50%, -50%)";
  
    document.body.appendChild(iframe);
  }
}

function initInputGayFix()
{
  document.querySelector("input[name=permanent]").onchange = function(evt) {
    var target = evt.target;
    var value = target.value.toLowerCase();

    if(value.includes("gay"))
    {
      var is = value.indexOf("gay");
      var toRemove = target.value.slice(is, is+3);

      target.value = target.value.replaceAll(toRemove, 'chad');
    }
  }
}

function changeTheme()
{
  setCookie('theme', getThemeId() == 0 ? 1 : 0, 365);
  location.reload();
}

function getThemeId()
{
  return getCookie("theme") == "" ? 0 : parseInt(getCookie("theme"));
}

function initNewTheme()
{
  var ps = document.evaluate("//p[contains(., 'ronaldo')]", document, null, XPathResult.ANY_TYPE, null)
  var el = ps.iterateNext();

  el = el.innerHTML = `<button class="button" style="width: 100%;" onclick="changeTheme()">Change Theme</button>`

  var themeid = getThemeId();

  //console.log(themeid);

  if(themeid === 0) return;

  var messages = document.querySelector("#contents").innerHTML.replaceAll("<p></p>", "");

  if(!messages.startsWith("<p>"))
  {
    var position = messages.indexOf("<p>");
    messages = '<p>' + messages.substring(0, position) + '</p>' + messages.substring(position);
  }
  

  document.querySelectorAll("center").forEach((s) => s.remove())

  var style = document.createElement("style");

  style.textContent = `
  div { border: none; }
  body {
    margin: 12px;
    background: url(https://sayanything.ml/background-overlay/overlay.svg);
  }
  #contents p {
    color: #000;
    background: #cdcdcd85;
    padding: 8px;
    margin: 2px;
  }
  form b { color: white; }
  `;

  document.body.prepend(style);
 
  

  var theme = document.createElement("div");
  document.body.prepend(theme);

  theme.outerHTML = `
  <div style="background: #233D51; padding: 12px;">
    <h1 style="margin: 0px;">Permanent Chat</h1>
  </div>

  <form method="post" action="/edit/permanent/" name="permanent" style="margin-top: 30px; margin-bottom: 30px">
    <b>Enter text:</b>
    <br>
    
    <div style="background: red; width: 80%; height: 50px; display: inline-block;">
      <input autocomplete="off" name="permanent" style="width: 100%; height: 100%;" type="text"/>
    </div><div style="background: blue; width: 20%; height: 50px; display: inline-block;">
      <button type="submit" style="width: 100%; border: none; outline: none; height: 100%; background: #233D51; color: white; cursor: pointer;">SUBMIT</button>
    </div>

  </form>

  <div id="contents"></div>
  `;

  document.querySelector("#contents").innerHTML = messages;

  
}


try {
  main();
} catch (error) {
  console.error(error);
}

function setCookie(cname, cvalue, exdays) { var d = new Date(); d.setTime(d.getTime() + (exdays*24*60*60*1000)); var expires = "expires="+ d.toUTCString(); document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; }
function getCookie(cname) { var name = cname + "="; var decodedCookie = decodeURIComponent(document.cookie); var ca = decodedCookie.split(';'); for(var i = 0; i <ca.length; i++) { var c = ca[i]; while (c.charAt(0) == ' ') { c = c.substring(1); } if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }} return ""; }