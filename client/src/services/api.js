import axios from 'axios'
import config from '../assets/config'

export const HTTP = axios.create({
  baseURL: `${config.serverURL}:${config.serverPort}/`
})
