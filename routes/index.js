const fs = require('fs')

exports.index = function (req, res, next) {
  const lyrics = []
  fs.readdir('./lyrics', function (err, files) {
    if (err) { return console.log('Unable to scan directory: ' + err) }
    let count = 0
    for (const fileName of files) {
      fs.readFile(`./lyrics/${fileName}`, 'utf8', (err, data) => {
        count++
        if (err) {
          console.error(err);
          return;
        }
        const lines = data.replace(/\r/g, '').split('\n')
        lyrics.push({
          title: lines[0].trim(),
          lines: lines.slice(2)
        })
        if (count === files.length) {
          lyrics.sort(function (a, b) {
            return (a.title > b.title ? 1 : -1)
          })
          res.render('index', {
            lyrics: JSON.stringify(lyrics)
          })
        }
      })
    }
  })
}
