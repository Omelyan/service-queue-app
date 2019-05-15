import {HTTP} from '@/services/api'

export default {
  getUpdatesAfter (date, callback) {
    HTTP
      .get('queue/updatesAfter/' + date)
      .then(response => response.status === 200 ? callback(response.data) : 0)
      .catch(error => error)
  }
}
