/* global $ */

function setText (atext) {
  var headHeight = $('#textarea h2').outerHeight()
  $('#textarea').fadeOut(500, function () {
    $('#testtextarea').html(atext)
    $('#textarea').css({ display: 'block', visibility: 'hidden' })

    $('#textarea .col1, #textarea .col2, #textarea .col3').empty()
    $('#textarea h2').text($('#testtextarea h2').text())
    $('#testtextarea h2').remove()
    if ($('#testtextarea p:first-child').text().trim().length === 0) {
      $('#testtextarea p:first-child').remove()
    }

    var textHeight = $(window).height() - 40 - headHeight
    // var nofcols = getNofCols(textHeight)
    var pHeight = $('#testtextarea p:first-child').innerHeight()

    $('#testtextarea p').each(function () {
      if ($('#textarea .col1').innerHeight() > textHeight - 20 - pHeight) {
        if ($('#textarea .col2').innerHeight() > textHeight - 20 - pHeight) {
          $('#textarea .col3').append($(this))
        } else {
          $('#textarea .col2').append($(this))
        }
      } else {
        $('#textarea .col1').append($(this))
      }
    })

    $('#textarea').css({ display: 'none', visibility: 'visible' })
    $('#textarea').fadeIn()
  })
}

function getNofCols (textHeight) {
  var nofcols = 1
  if (!setTextSize(nofcols, textHeight)) {
    nofcols = 2
    if (!setTextSize(nofcols, textHeight)) {
      nofcols = 3
      setTextSize(nofcols, textHeight)
    }
  }
  if (nofcols < 3) $('#textarea .col3').css({ 'margin-left': 0, display: 'none' })
  if (nofcols < 2) $('#textarea .col2').css({ 'margin-left': 0, display: 'none' })
  return nofcols
}

function setTextSize (nofcols, textHeight) {
  var minsize = (nofcols === 1 ? 34 : (nofcols === 2 ? 26 : 18))
  var colwidth = 100 / nofcols - (2 * (nofcols - 1))
  $('#testtextarea, #textarea .col1, #textarea .col2, #textarea .col3').css('width', colwidth + '%')
  $('#textarea .col2, #textarea .col3').css({ 'margin-left': '2%', display: 'block' })

  var fsize = 50
  $('p').css({ 'font-size': fsize + 'px' })
  $('h2').css({ 'font-size': (fsize * 1.2) + 'px' })
  while (fsize > minsize && $('#testtextarea').innerHeight() > nofcols * textHeight - 40) {
    fsize--
    $('p').css({ 'font-size': fsize + 'px' })
    $('h2').css({ 'font-size': (fsize * 1.2) + 'px' })
  }
  if (fsize > minsize) return true
  else return false
}
