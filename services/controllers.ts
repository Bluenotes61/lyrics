import express from 'express'
import { readdir, readFile } from 'fs/promises'

const router = express.Router()

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
  { slug: 'N', name: 'Barn' }
]

router.get('/', async (req, res) => {
  const lyrics = []
  let files
  try {
    files = await readdir('./songs')
    let count = 0
    for (const fileName of files) {
      count++
      let data
      try {
        data = await readFile(`./songs/${fileName}`, 'utf8')
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
      } catch (err) {
        console.error(err)
      }
    }
  } catch (err) {
    console.error('Unable to scan directory: ' + err)
    return res.status(500).send('Error reading directory')
  }
})

export default router
