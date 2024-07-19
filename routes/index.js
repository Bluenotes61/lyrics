const fs = require('fs')
const categories = [
  { slug: 'S', name: 'Svenska' },
  { slug: 'P', name: 'Pop' },
  { slug: 'R', name: 'Rock' },
  { slug: 'V', name: 'Visor' },
  { slug: 'L', name: 'Schlager' },
  { slug: 'J', name: 'Jazz' },
  { slug: 'M', name: 'Musikal' },
  { slug: 'E', name: 'Ehlde' },
  { slug: 'U', name: 'Soul' },
  { slug: 'B', name: 'Blues' },
  { slug: 'N', name: 'Barn' },
  { slug: 'Ö', name: 'Joens' }
]

exports.index = function (req, res, next) {
  const lyrics = []
  fs.readdir('./songs', function (err, files) {
    if (err) { return console.log('Unable to scan directory: ' + err) }
    let count = 0
    for (const fileName of files) {
      fs.readFile(`./songs/${fileName}`, 'utf8', (err, data) => {
        count++
        if (err) {
          console.error(err)
          return
        }
        const lines = data.replace(/\r/g, '').split('\n')
        lyrics.push({
          title: lines[0].trim(),
          categories: lines[1].trim(),
          artist: lines[2].trim(),
          lines: lines.slice(4)
        })
        if (count === files.length) {
          lyrics.sort(function (a, b) {
            return (a.title > b.title ? 1 : -1)
          })
          res.render('index', {
            lyrics: JSON.stringify(lyrics),
            categories: categories
          })
        }
      })
    }
  })
}
