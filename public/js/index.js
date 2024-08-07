/* global $, lyrics */

var currsel = 0
var fitScreen = false
var filterLyrics = lyrics
var nofrows = 0

$(document).ready(function () {
  $('.catcheck').prop('checked', true)
  applyFilter()

  $('.catcheck').click(function () {
    applyFilter()
  })

  $('#cattoggle').click(function () {
    $('#categories').toggle()
    $('#search').hide()
    $('#searchinput').val('')
    applyFilter()
  })  
  $('#searchtoggle').click(function () {
    $('#search').toggle()
    $('#searchinput').focus().val('')
    $('#categories').hide()
    applyFilter()
  })  

  $('.catcheckall').click(function () {
    const checked = !!$('.catcheckall:checked').length
    $('.catcheck').prop('checked', checked)
    applyFilter()
  })

  $('#searchinput').keyup(function () {
    applyFilter()
  })

  renderLyrics()

  $('body').keyup(function (e) {
    if ($('#selectarea').is(':visible')) {
      if (e.keyCode === 40 && currsel < filterLyrics.length - 1) {
        currsel++
        $('#s' + currsel).focus()
      } else if (e.keyCode === 38 && currsel > 0) {
        currsel--
        $('#s' + currsel).focus()
      } else if (e.keyCode === 37 && currsel > nofrows) {
        currsel -= nofrows
        $('#s' + currsel).focus()
      } else if (e.keyCode === 39 && currsel < filterLrics.length - nofrows - 1) {
        currsel += nofrows
        $('#s' + currsel).focus()
      }
    } else if (e.keyCode === 13 || e.keyCode === 27) {
      $('#textarea').fadeOut()
      $('#selectarea').fadeIn()
      $('#s' + currsel).focus()
    }
  })

  $('#textarea').click(function () {
    $('#textarea').fadeOut()
    $('#selectarea').fadeIn()
    $('#s' + currsel).focus()
  })

  $('#s0').focus()
})

function applyFilter() {
  if ($('#searchinput').val().length > 0) {
    const search = $('#searchinput').val().toLowerCase()
    filterLyrics = lyrics.filter(l => {
      return l.title.toLowerCase().includes(search) ||
        l.artist.toLowerCase().includes(search) ||
        l.lines.some(line => line.toLowerCase().includes(search))
    })
  } else {
    const selCat = []
    $('.catcheck:checked').each(function () {
      selCat.push($(this).val());
    })
    filterLyrics = lyrics.filter(l => {
      return l.categories.split('').some(c => selCat.includes(c))
    })
  }
  renderLyrics()
}
  
function renderLyrics() {
  var windowWidth = $(document).width()

  var songs = ''
  for (var i = 0; i < filterLyrics.length; i++) {
    songs += '<a href="javascript:void(0)" id="s' + i + '" class="onesong">' + filterLyrics[i].title + '</a>'
  }

  var nofcols = Math.floor(windowWidth / 300)
  $('#selectarea').css('width', windowWidth - 40)
  $('#songs').html(songs).tabulate({
    nofcols: nofcols,
    colmargin: 10
  })
  $('#songs .onesong').click(function () {
    currsel = parseInt($(this).attr('id').substring(1))
    showText()
  })
  $('#songs .onesong').focus(function () {
    currsel = parseInt($(this).attr('id').substring(1))
  })

  nofrows = $('#songs div:first-child').children('a').length
}

function isFocused (a) {
  currsel = parseInt($(a).attr('id').substring(1))
}

function itemClicked (a) {
  currsel = parseInt($(a).attr('id').substring(1))
}

function showText () {
  setText(filterLyrics[currsel])
}

function setText (alyric) {
  var windowWidth = $(document).width()
  let nofCols = 3
  if (windowWidth < 1000) { nofCols = 2 }
  if (windowWidth < 500) { nofCols = 1 }

  $('#selectarea, #textarea').fadeOut(500, function () {
    let fontSize = 40
    setFontSize(fontSize)

    $('#testtextarea').empty().show()
    $('#testtextarea').append('<h2>Title</h2>')

    let linesPerCol = 0
    if (fitScreen) {
      linesPerCol = Math.floor(alyric.lines.length / nofCols)
    } else {
      while (!isOverflow('#testtextarea') && linesPerCol < 100) {
        $('#testtextarea').append('<p>A line</p>')
        linesPerCol++
      }
      if (linesPerCol * nofCols < alyric.lines.length) {
        linesPerCol = Math.floor(alyric.lines.length / nofCols)
      }
    }
    $('#testtextarea').hide()

    $('#textarea .title, #textarea .col1, #textarea .col2, #textarea .col3').empty()
    $('#textarea .title').text(alyric.title)

    let lineCount = 0
    for (let col = 1; col <= nofCols; col++) {
      for (let i = 0; i < linesPerCol; i++) {
        if (lineCount < alyric.lines.length && (i > 0 || alyric.lines[lineCount].length > 0)) {
          addLine(col, alyric.lines[lineCount])
        }
        lineCount++
      }
    }
    for (let line = lineCount; line < alyric.lines.length; line++) {
      addLine(nofCols, alyric.lines[line])
    }

    if ($('#textarea .col3').text().length === 0) { nofCols = 2 }
    if ($('#textarea .col2').text().length === 0) { nofCols = 1 }
    const colWidth = 90 / nofCols
    $('.col').css({ 'max-width': colWidth + '%' })

    if (fitScreen) {
      while (isOverflow('#textarea') && fontSize > 5) {
        fontSize--
        setFontSize(fontSize)
      }
    }

    $('#textarea').css({ display: 'none', visibility: 'visible' })
    $('#textarea').fadeIn()
  })
}

function isOverflow (area) {
  return $(area).height() > 0.90 * $(window).height()
}

function addLine (col, line) {
  if (line.length === 0) { line = '&nbsp;' }
  $('#textarea .col' + col).append('<p>' + line + '</p>')
}

function setFontSize (size) {
  $('p').css({ 'font-size': size + 'px' })
}
