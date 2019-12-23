import { HTTP } from '@/services/api'

export default {
  async getVideoSourceURL () {
    return `${HTTP.defaults.baseURL}queue/video`
  },

  getUpdatesAfter (date, callback) {
    HTTP
      .get('queue/updatesAfter/' + date)
      .then(response => {
        switch (response.status) {
          case 200: // data received
            callback(response.data)
            break
          case 204: // no content
            break
          case 205: // need to reload
            document.location.reload(true)
            break
        }
      })
      .catch(() => {})
  }
}
