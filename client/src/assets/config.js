export default {
  serverURL: `${document.location.protocol}//${document.location.hostname}`,
  serverPort: 3005,
  ticksInterval: 15 * 1000,
  sanitizeAfterTC: 40, // call sanitize after ticks count
  startAdsAfterTC: 60, // start ads again after ticks count
  videoWaitingTime: 9000
}
