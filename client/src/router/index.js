import Vue from 'vue'
import Router from 'vue-router'
import Queue from '@/components/Queue'

Vue.use(Router)

export default config => new Router({
  routes: [
    {
      path: '/queue',
      name: 'queue',
      component: Queue,
      props: () => ({
        ticksInterval: config.ticksInterval,
        sanitizeAfterTC: config.sanitizeAfterTC,
        startAdsAfterTC: config.startAdsAfterTC,
        videoWaitingTime: config.videoWaitingTime
      })
    }
  ]
})
