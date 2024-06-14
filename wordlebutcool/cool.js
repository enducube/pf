//wooderl cool

const words = loadFile("wordlebutcool/words.txt").split("\n");
var win = false;
var guessesleft = 10;

var wins = 0;
var losses = 0;
var guesses = [];
var sharestring = "";
const wrongemoji = "\uD83D\uDFE5";
const rightemoji = "\uD83D\uDFE9";

var today = new Date();
var todaynumberseed = today.getFullYear()*today.getMonth()*today.getDate();
var wordlenumber = ((today.getFullYear()*365)+(today.getMonth()*30)+today.getDate())-738201;


function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
var rand = mulberry32(todaynumberseed);
wordindex = Math.round(rand()*words.length);
correctword = stringToHashConversion(words[wordindex]);


function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
  }
  function stringToHashConversion(string) {
    var hashVal = 0;
    if (string.length == 0) return hashVal;
    for (i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hashVal = ((hashVal << 5) - hashVal) + char;
    hashVal = hashVal & hashVal;
       }
    return hashVal;
     }


words.forEach(element => {
  var coolbutton = document.createElement("button");
  coolbutton.classList.add("wordbutton");
  var t = document.createTextNode(element);
  coolbutton.appendChild(t);
  document.getElementById("buttonlist").appendChild(coolbutton);
});

document.getElementById("buttonlist").addEventListener("click", function(e){
  if (guessesleft > 0 && !e.target.classList.contains("wrong") && !win) {
    guessesleft -= 1;
    document.getElementById("guessesleft").innerHTML = "guesses left: " + guessesleft.toString();
    var isbutton = e.target.nodeName === "BUTTON";
    if (!isbutton && !e.target.classList.contains("done")) {
      return;
    }
    if (stringToHashConversion(e.target.innerHTML) != correctword) {
      guesses.push(words.indexOf(e.target.innerHTML));
      e.target.classList.add("wrong");
      if (guessesleft < 1) {
        var flash = document.createElement("div");
        var flashspan = document.createElement("span");
        flash.classList.add("flashthing");
        flash.appendChild(flashspan);
        flashspan.appendChild(document.createTextNode(words[wordindex]));
        document.body.appendChild(flash);
        losses += 1;
        document.getElementById("wins").innerHTML = wins;
        document.getElementById("losses").innerHTML = losses;
        document.getElementById('statistics').style.display = 'block';
      }
      save();
    }
    else if (stringToHashConversion(e.target.innerHTML) == correctword) {
      e.target.classList.add("right");
      guesses.push(words.indexOf(e.target.innerHTML));
      console.log("win");
      win = true;
      wins += 1;
      document.getElementById("wins").innerHTML = wins;
      document.getElementById("losses").innerHTML = losses;
      save();
      document.getElementById('statistics').style.display = 'block';
    }
    
  }
});



const btn = document.getElementById('sharebutton');
// sharing results
btn.addEventListener('click', async () => {
  sharestring = "totally real wordle "+wordlenumber.toString()+" "+(10-guessesleft)+"/10\n"
  if (!win) {
    sharestring = "totally real wordle "+wordlenumber.toString()+" X/10\n"
  }
    guesses.forEach(function(e) {
      if (e == wordindex) {
        sharestring += rightemoji;
      } else {
        sharestring += wrongemoji;
      }
    });
  if (navigator.share  && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    await navigator.share({text: sharestring})
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    await navigator.clipboard.writeText(sharestring);
    alert("copied to clipboard");
  }
});


// saving stuff

function load() {
  if (document.cookie != "") {
    var loadedthing = decodeURIComponent(document.cookie);
    var splitthing = loadedthing.split(";");
    wins = parseInt(splitthing[0].split("=")[1]);
    losses = parseInt(splitthing[1].split("=")[1]);
    guesses = splitthing[2].split("=")[1].split(",");
    if (todaynumberseed != splitthing[3].split("=")[1]) {
      guesses = [];
    }
    guessesleft = 10 - (guesses.length);
    if (guesses != []) {
      var wordbuttons = Array.from(document.getElementsByClassName("wordbutton"));
      guesses.forEach(function(e) {
        if (e == wordindex) {
          wordbuttons[e].classList.add("right");
          win = true;
          document.getElementById('statistics').style.display = 'block';
        } else {
          wordbuttons[e].classList.add("wrong");
        }
        
      });
    }

   
    document.getElementById("guessesleft").innerHTML = "guesses left: " + guessesleft.toString();
    document.getElementById("wins").innerHTML = wins;
    document.getElementById("losses").innerHTML = losses;
  }
 
}

function save() {
  document.cookie = encodeURIComponent("wins="+wins+";losses="+losses+";guesses="+guesses.toString()+";lastplayedseed="+todaynumberseed+";");
  //console.log(decodeURIComponent(document.cookie));
}

load();
if (guessesleft < 1) {
  document.getElementById('statistics').style.display = 'block';
  var flash = document.createElement("div");
  var flashspan = document.createElement("span");
  flash.classList.add("flashthing");
  flash.appendChild(flashspan);
  flashspan.appendChild(document.createTextNode(words[wordindex]));
  document.body.appendChild(flash);
}
setInterval(function() {
  today = new Date();
  document.getElementById("timeleft").innerHTML = (23-today.getHours()) + ":" + ("0"+(60-today.getMinutes())).slice(-2) + ":" + ("0"+(60-today.getSeconds())).slice(-2);
  }, 1000);
document.getElementById("timeleft").innerHTML = (23-today.getHours()) + ":" + (60-today.getMinutes()) + ":" + (64-today.getSeconds());
