const fs = require('fs')

module.exports = {
  getVideo (req, res) {
    const path = 'assets/ad-videos/video.mp4'
    const status = fs.statSync(path)
    const fileSize = status.size
    const range = req.headers.range

    if (range) {
      const parts = range.match(/\d+/g)
      const start = Number(parts[0]) || 0
      const end = Number(parts[1]) || fileSize - 1
      const chunkSize = end - start + 1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4'
      }

      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const file = fs.createReadStream(path)
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      }

      res.writeHead(200, head)
      file.pipe(res)
    }
  }
}
