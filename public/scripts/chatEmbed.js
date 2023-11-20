if(document.getElementById("dmdassc-load-image")) {
  document.getElementById("dmdassc-load-image").remove();
  document.getElementById("dmdassc-load-script").remove();
}



//tag
//<img id="dmdassc-load-image" src="https://www.dmdassc.ml/load-gif.gif" onload="var script = document.createElement('script'); script.id = 'dmdassc-load-script'; script.src = 'https://www.dmdassc.ml/scripts/sayanything-1.js'; document.head.appendChild(script);">`

console.log("Mission success!!")


let openChatButton;
let chatIframe;

const CHAT_WIDTH = 240;

function init() {

  openChatButton = document.createElement("img");
  openChatButton.src = "https://www.dmdassc.ml/assets/img/chat.svg";
  openChatButton.width = 40;
  openChatButton.height = 40;
  openChatButton.title = "Open chat"
  openChatButton.style.position = "fixed";
  openChatButton.style.right = "5px";
  openChatButton.style.top = "5px";
  openChatButton.style.opacity = "0.7";
  openChatButton.style.cursor = "pointer";
  openChatButton.style.transition = "right 0.2s";
  openChatButton.onmouseover = () => {
    openChatButton.style.opacity = "1";
  };
  openChatButton.onmouseout = () => {
    openChatButton.style.opacity = "0.7";
  };
  openChatButton.onclick = () => {
    chatDiv.style.right = "0px";
    openChatButton.style.right = (CHAT_WIDTH + 5) + "px";
  };
  document.body.appendChild(openChatButton);

  chatDiv = document.createElement("div");
  chatDiv.style.width = CHAT_WIDTH + "px";
  chatDiv.style.height = 200 + "px";
  chatDiv.style.position = "fixed";
  chatDiv.style.right = -CHAT_WIDTH + "px";
  chatDiv.style.top = "0px";
  chatDiv.style.transition = "right 0.2s";
  chatIframe = document.createElement("iframe");
  chatIframe.src = "https://www.dmdassc.ml/chat";
  chatIframe.width = "100%";
  chatIframe.height = "100%";
  chatIframe.frameBorder = "0";
  chatIframe.scrolling = "no";

  chatDiv.appendChild(chatIframe);

  document.body.appendChild(chatDiv);
  
  console.log("init()");
}

if(!location.href.includes("sayanything")) {
  init();
}