var windowHeight = 0;
var currsel = 0;
var texts = [];
var margin = 80;

$(document).ready(function(){
  readAllTexts().then(function(){
    windowHeight = $(document).height() - 80;
    var windowWidth = $(document).width();
    var colwidth = (windowWidth - 40 - 30)/2;

    var songs = "";
    for (var i=0; i < texts.length; i++) {
      songs += "<a href='javascript:void(0)' id='s" + i + "' class='onesong'>" + texts[i].title + "</a>";
    }

    $("#selectarea h1").fadeOut();

    var nofcols = Math.floor(windowWidth/300);
    $("#selectarea").css("width", windowWidth-40);
    $("#songs").html(songs).tabulate({
      nofcols:nofcols,
      colmargin:10
    });
    $("#songs .onesong").click(function(){
      currsel = parseInt($(this).attr("id").substring(1));
      showText();
    });
    $("#songs .onesong").focus(function(){
      currsel = parseInt($(this).attr("id").substring(1));  
    });

    var nofrows = $("#songs div:first-child").children("a").length;

    $("body").keyup(function(e){
      if ($("#selectarea").is(":visible")) {
        if (e.keyCode == 40 && currsel < texts.length - 1) {
          currsel++;
          $("#s" + currsel).focus();
        }
        else if (e.keyCode == 38 && currsel > 0) {
          currsel--;
          $("#s" + currsel).focus();
        }
        else if (e.keyCode == 37 && currsel > nofrows) {
          currsel -= nofrows;
          $("#s" + currsel).focus();
        }
        else if (e.keyCode == 39 && currsel < texts.length - nofrows - 1) {
          currsel += nofrows;
          $("#s" + currsel).focus();
        }
      }
      else if (e.keyCode == 13 || e.keyCode == 27) {
        $("#textarea").fadeOut();
        $("#selectarea").fadeIn();
        $("#s" + currsel).focus();
      }      
    });

    $("#textarea").click(function(){
      $("#textarea").fadeOut();
      $("#selectarea").fadeIn();
      $("#s" + currsel).focus();
    });

    $("#s0").focus();

  });
});

function isFocused(a) {
  currsel = parseInt($(a).attr("id").substring(1));
}

function itemClicked(a) {
console.log(clicked);
  currsel = parseInt($(a).attr("id").substring(1));
}

function showText() {
  setText(texts[currsel].text);
}

function readAllTexts() {
  return readTextFile('/texter.txt').then(function(txt){
    var songs = txt.split('\n');
    var promises = [];
    for (var i=0; i < songs.length; i++)
      promises.push(getOneText(songs[i]));
    return Q.all(promises);
  }).then(function(){
    texts.sort(function(a, b){
      return (a.title > b.title ? 1 : -1);
    });
  });
}

function getOneText(song) {
  return readTextFile("/texter/" + song + ".txt").then(
    function(txt){
      var atext = formatSongText(txt);
      if (atext.title && atext.title.length > 0)
        texts.push(atext);
    },
    function(err) {
      console.log(err);
    }
  );
}

function readTextFile(file) {
  var d = Q.defer();
  try {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if ((rawFile.readyState === 4) && (rawFile.status === 200 || rawFile.status == 0))
        d.resolve(rawFile.responseText);
      else {
        d.reject("Error1 reading " + file)
      }
    }
    rawFile.send();
  }
  catch(e) {
    d.reject(e);
  }
  return d.promise;
}

function formatSongText(atext) {
  var response = {title:"", text:""};
  var lines = atext.split('\r\n');
  for (var i=0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/\"/g, '\'');
    if (lines[i].length == 0) lines[i] = "&nbsp;";
    if (response.text.length == 0) {
      response.title = lines[i];
      response.text = "<h2>" + lines[i] + "</h2>";
    }
    else 
      response.text += "<p>" + lines[i] + "</p>";
  }
  return response;
}

function setText(atext) {
  var headHeight = $("#textarea h2").outerHeight();
  $("#selectarea, #textarea").fadeOut(500, function(){
    $("#testtextarea").html(atext);
    $("#textarea").css({"display":"block", "visibility":"hidden"});
    
    $("#textarea .col1, #textarea .col2, #textarea .col3").empty();
    $("#textarea h2").text($("#testtextarea h2").text());
    $("#testtextarea h2").remove();
    if ($("#testtextarea p:first-child").text().trim().length == 0)
      $("#testtextarea p:first-child").remove();

    var textHeight = $(window).height() - margin - headHeight;
    var nofcols = getNofCols(textHeight);
    var pHeight = $("#testtextarea p:first-child").innerHeight();

    $("#testtextarea p").each(function(){
      if ($("#textarea .col1").innerHeight() > textHeight - margin/2 - pHeight) {
        if ($("#textarea .col2").innerHeight() > textHeight - margin/2 - pHeight) {
          $("#textarea .col3").append($(this));  
        }
        else {
          $("#textarea .col2").append($(this));  
        }
      }
      else {
        $("#textarea .col1").append($(this));
      }
    });

    $("#textarea").css({"display":"none", "visibility":"visible"});
    $("#textarea").fadeIn();
  });
}

function getNofCols(textHeight) {
  var nofcols = 1;
  if (!setTextSize(nofcols, textHeight)) {
    nofcols = 2;
    if (!setTextSize(nofcols, textHeight)) {
      nofcols = 3;
      setTextSize(nofcols, textHeight);
    }
  }
  if (nofcols < 3) $("#textarea .col3").css({"margin-left":0, "display":"none"});
  if (nofcols < 2) $("#textarea .col2").css({"margin-left":0, "display":"none"});
  return nofcols;
}

function setTextSize(nofcols, textHeight) {
  var colwidth = 100/nofcols - (2*(nofcols-1));
  $("#testtextarea, #textarea .col1, #textarea .col2, #textarea .col3").css("width", colwidth + "%");
  $("#textarea .col2, #textarea .col3").css({"margin-left": "2%", "display":"block"});
  var minsize = getMinSize(nofcols);

  var fsize = 40;
  $("p").css({"font-size":fsize + "px"});
  $("h2").css({"font-size":(fsize*1.2) + "px"});
  while (fsize > minsize && $("#testtextarea").innerHeight() > nofcols*textHeight - margin) {
    fsize--;
    $("p").css({"font-size":fsize + "px"});
    $("h2").css({"font-size":(fsize*1.2) + "px"});
  }
  if (fsize > minsize) return true;
  else return false;
}

function getMinSize(nofcols) {
  var w = $("#textarea").innerWidth();
  return (nofcols == 1 ? w/40 : (nofcols == 2 ? w/60 : w/80));
}
