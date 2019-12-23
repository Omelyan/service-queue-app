<template>
  <v-app id="service-queue" dark>
    <v-content :class="{ 'rainbow': showQueue }" :style="`--screen-factor: ${screenFactor}; --offset: ${offset}`">
      <div id="ads" v-if="showAds">
        <video :src="videoSourceURL" type="video/mp4" muted autoplay
          @playing="videoPlaying"
          @waiting="videoWaiting"
          @error="videoWaiting"
          @ended="videoEnded"
        >
        </video>
      </div><!--

   --><transition type="transition" name="slide-from-top">
        <span id="clock" class="md-elevation-3" v-if="showQueue">{{ timeString }}</span>
      </transition><!--

   --><transition type="transition" name="fade" @after-leave="showAds = true">
        <div id="queue" v-if="showQueue">
          <transition-group
            name="queued-item"
            tag="ul"
            :css="false"
            @before-enter="beforeEnterQueue"
            @enter="enterQueue"
            @leave="leaveQueue"
          >
            <queued-item
            v-for="(item, index) in queueSlice"
            class="queued-item"
            :key="item.id"
            :data-index="index"
            :data-reverse-index="queueSlice.length - index - 1"
            :state="item.state"
            :symbol.sync="item.symbol"
            :swinging.sync="item.swinging"
            :blinking.sync="item.blinking"
            :left="calculate(item)"
            :plate="item.plate"
            />
          </transition-group>
        </div>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import QueuedItem from './Queued-Item'
import queueService from '@/services/queue'
import Velocity from 'velocity-animate'

export default {
  components: {
    QueuedItem
  },

  props: {
    ticksInterval: { type: Number, default: 5000 },
    sanitizeAfterTC: { type: Number, default: 60 },
    startAdsAfterTC: { type: Number, default: 60 },
    videoWaitingTime: { type: Number, default: 6000 }
  },

  data () {
    return {
      queue: [],
      queueIsDeprecated: false,
      showQueue: false,
      showAds: true,
      timer: null,
      sanitizeTC: 0,
      startAdsTC: 0,
      updatedStamp: 0,
      videoSourceURL: '',
      videoTimeout: null,
      screenFactor: 16,
      offset: 0,
      time: {
        now: 0,
        hours: 0,
        minutes: 0
      }
    }
  },

  computed: {
    queueSlice () {
      return this.queueIsDeprecated ? [] : this.queue.slice(0, 12)
    },

    timeString () {
      return String('0' + this.time.hours).slice(-2) +
        '\xa0' + String('0' + this.time.minutes).slice(-2)
    }
  },

  methods: {
    update ({ items = [], timeStamp = 0 }) {
      const queueItem = (index, replace, item) => this.queue.splice(index, replace, {
        id: item.id,
        left: item.left,
        state: item.state,
        plate: item.plate,
        symbol: item.symbol,
        updated: item.updated,
        swinging: true,
        blinking: true
      })
      let previousItem = this.queue[0]
      let unsorted = false

      this.updatedStamp = timeStamp

      // update queue's items
      for (let index = 0; index < this.queue.length; index++) {
        const currentItem = this.queue[index]
        const itemIndex = items.findIndex(item => item.id === currentItem.id)
        if (itemIndex + 1) {
          queueItem(index, 1, items[itemIndex])
          items.splice(itemIndex, 1)
        } else if (items.length === 0) return
        unsorted = unsorted || this.compare(currentItem, previousItem) < 0
        previousItem = currentItem
      }

      if (unsorted) {
        this.queue.sort(this.compare)
      }

      // add rest items to queue:
      for (const item of items) {
        let index = 0
        for (; index < this.queue.length && this.compare(this.queue[index], item) < 0; index++);
        queueItem(index, 0, item)
      }
    },

    compare (item1, item2) {
      const x = this.calculate(item1)
      const y = this.calculate(item2)
      return (x - y) * (1 - 2 * (x < 0 && y < 0))
    },

    calculate (item) {
      return item.left - Math.trunc((this.time.now - item.updated) / 60000)
    },

    beforeEnterQueue (item) {
      item.style.opacity = 0
    },

    enterQueue (item, done) {
      const delay = item.dataset.index * (1 / 5) * 1000

      Velocity(item, { opacity: 1 }, {
        delay,
        duration: 1 * 1000,
        complete: () => {
          item.classList.add('on')
          done()
        }
      })
    },

    leaveQueue (item, done) {
      let delay = item.dataset.reverseIndex * (1 / 5) * 1000

      item.classList.remove('on')
      if (this.queueIsDeprecated === false) {
        item.style.position = 'absolute'
        delay = 0
      }

      Velocity(item, { opacity: 0 }, {
        delay,
        duration: (1 / 3) * 1000,
        complete: done
      })
    },

    sanitize () {
      for (let index = this.queue.length; index--;) {
        const item = this.queue[index]
        if (this.calculate(item) < -30 || item.state === 'error') this.queue.splice(index, 1)
      }

      if (this.queue.length === 0) this.startAds()
    },

    async startAds () {
      try {
        this.videoSourceURL = await queueService.getVideoSourceURL()
      } catch (error) {
        this.stopAds()
        throw new Error(`Cannot get a video source (${error}).`)
      }
      this.videoWaiting()
      this.queueIsDeprecated = true
      setTimeout(() => void (this.showQueue = false), 0)
    },

    stopAds () {
      this.offset = Math.random()
      this.showAds = false
      this.showQueue = true
      setTimeout(() => void (this.queueIsDeprecated = false), 0)
    },

    videoPlaying () {
      clearTimeout(this.videoTimeout)
    },

    videoWaiting () {
      clearTimeout(this.videoTimeout)
      this.videoTimeout = setTimeout(this.stopAds, this.videoWaitingTime)
    },

    videoEnded (event) {
      if (this.queue.length > 0) return this.stopAds()
      try {
        this.startAds()
      } catch (error) {
        throw new Error(`Unable to start a video (${error}).`)
      }
      event.target.play()
    },

    ticktock () {
      const today = new Date()
      this.time.now = today.getTime()
      this.time.hours = today.getHours()
      this.time.minutes = today.getMinutes()

      this.sanitizeTC += 1

      if (this.showQueue) {
        this.startAdsTC += 1
        if (this.startAdsTC % this.startAdsAfterTC === 0) this.startAds()
      }

      if (this.sanitizeTC % this.sanitizeAfterTC === 0) this.sanitize()

      queueService.getUpdatesAfter(this.updatedStamp, this.update)
    }
  },

  mounted () {
    this.screenFactor = Math.round(window.innerWidth / 42)
    this.timer = setInterval(this.ticktock, this.ticksInterval)
    this.startAds()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.v-content {
  background-color: black;
  font-size: calc(var(--screen-factor) * 1px);
  line-height: 1;
}

.slide-from-top-enter,
.slide-from-top-leave-to {
  transform: translateY(-105%);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $an-2 ease-in-out;
}

#clock {
  position: absolute;
  z-index: 1;
  left: calc(14% + 2% * var(--offset));
  font-size: $fs-65;
  padding: $pa-14 $pa-13;
  border-radius: 0 0 $pa-10 $pa-10;
  background-color: var(--v-info-base);
  transition: transform ease $an-13 $an-43;
  &::after {
    content: ":";
    position: absolute;
    right: 2.567ch;
    bottom: .5ch;
    animation: blinking 1s ease infinite;
  }
}

@keyframes blinking {
  50% { opacity: 0; }
}

#ads {
  height: 100%;
  > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

#queue {
  background-color: var(--v-primary-base);
  padding-top: calc(#{$pa-2} + #{$pa-13} * var(--offset));
  min-height: 100%;
  animation: rainbow 60s ease-in-out $an-2 infinite;
  animation-play-state: paused;

  ul {
    font-size: $fs-2;
    list-style-type: none;
    transform-style: preserve-3d;
    perspective: 190vw;
    padding: 0;

    > li.queued-item {
      display: flex;
      align-items: baseline;
      width: 100%;
      margin-bottom: $ma-13;
      transition: transform ease-in $an-34;
    }
  }
}

.rainbow #queue {
  animation-play-state: running;
}

@keyframes rainbow {
  25% { background-color: var(--v-primary-base); }
  50% { background-color: var(--v-secondary-base); }
  75% { background-color: var(--v-accent-base); }
}
</style>
