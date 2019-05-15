<template>
  <v-app id="queue" dark>
    <v-content :class="{ rainbow: queue.length }">
      <div id="tray">
        <transition name="slide-from-top">
          <span key="clock" class="clock md-elevation-3" v-if="queue.length">{{ timeString }}</span><!--
       --><span key="logo" class="logo md-elevation-3" v-else></span>
        </transition>
      </div><!--
   --><div id="queue-list" v-if="queue.length">
        <transition-group name="queued-item" tag="ul">
          <queued-item
          class="queued-item"
          v-for="item in queue"
          :key="item.cID"
          :state="item.state"
          :symbol.sync="item.symbol"
          :updated="item.updated"
          :left="calculate(item)"
          :plate="item.plate"
          />
        </transition-group>
      </div><!--
   --><div id="wallpaper" v-else></div>
    </v-content>
  </v-app>
</template>

<script>
import QueuedItem from './Queued-Item'
import queueService from '@/services/queue'

export default {
  components: {
    QueuedItem
  },

  props: {
    ticksInterval: {
      type: Number,
      default: 30000
    }
  },

  data () {
    return {
      queue: [],
      interval: null,
      updatedStamp: 0,
      time: {
        now: 0,
        hours: 0,
        minutes: 0
      }
    }
  },

  computed: {
    timeString () {
      return String('0' + this.time.hours).slice(-2) +
        '\xa0' + String('0' + this.time.minutes).slice(-2)
    }
  },

  methods: {
    update ({items = [], timeStamp = 0}) {
      const queueItem = (index, replace, item) => this.queue.splice(index, replace, {
        cID: item.cID,
        left: item.left,
        state: item.state,
        plate: item.plate,
        symbol: item.symbol,
        updated: item.updated
      })
      let previousItem = this.queue[0]
      let unsorted = false

      this.updatedStamp = timeStamp

      // update queue's items
      for (let index = 0; index < this.queue.length; index++) {
        const currentItem = this.queue[index]
        const itemIndex = items.findIndex(item => item.cID === currentItem.cID)
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

      // add rest items to queue
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

    sanitize () {
      for (let index = this.queue.length; index--;) {
        if (this.calculate(this.queue[index]) < -30) this.queue.splice(index, 1)
      }
    },

    ticktock () {
      const today = new Date()
      this.time.now = today.getTime()
      this.time.hours = today.getHours()
      this.time.minutes = today.getMinutes()

      queueService.getUpdatesAfter(this.updatedStamp, this.update)
      if (this.time.minutes % 20 === 0) {
        this.sanitize()
      }
    }
  },

  mounted () {
    this.$el.style.setProperty('--screen-factor', Math.trunc(window.innerWidth / 24))
    this.interval = setInterval(this.ticktock, this.ticksInterval)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.v-content {
  &.rainbow {
    animation-play-state: running;
  }
  background-color: var(--v-primary-base);
  animation: rainbow 60s ease-in-out infinite;
  animation-play-state: paused;
  transform-style: preserve-3d;
  perspective: 190vw;
  font-size: calc(var(--screen-factor) * 4%);
  line-height: 1;
  // cursor: none; // TODO: none
}

@keyframes rainbow {
  25% {
    background-color: var(--v-primary-base);
  }
  50% {
    background-color: var(--v-secondary-base);
  }
  75% {
    background-color: var(--v-accent-base);
  }
}

#wallpaper {
  background-image: url('../resources/ads/Volkswagen.jpg');
  background-size: cover;
  height: 100%;
  animation: wallpaper 90s linear infinite;
}

@keyframes wallpaper {
  50% {
    background-position-x: 100%;
  }
}

#tray {
  .clock {
    position: absolute;
    left: 15%;
    padding: $pa-14 $pa-13;
    border-radius: 0 0 $pa-10 $pa-10;
    background-color: var(--v-info-base);
    transition: transform ease-in $an-13 $an-12;
    &::after {
      content: ":";
      position: absolute;
      right: 2.567ch;
      animation: blinking 1s ease infinite;
    }
  }

  .logo {
    position: absolute;
    height: $ma-43;
    width: $ma-43;
    left: 7%;
    background-image: url('../resources/avtomyr-logo.png');
    background-size: cover;
    transition: transform ease-in $an-13;
  }

  position: sticky;
  top: 0;
  z-index: 1;
}

@keyframes blinking {
  50% {
    opacity: 0;
  }
}

// Queue
#queue-list ul {
  font-size: 2em;
  margin-top: $ma-34;
  list-style-type: none;
  padding: 0;
}

.queued-item {
  display: flex;
  align-items: baseline;
  width: 100%;
  margin-bottom: $ma-13;
  transition: all ease $an-1;
}

// Transitions
.queued-item-enter, .queued-item-leave-to {
  transform: translateY(25%);
  opacity: 0;
}

.queued-item-enter-active {
  transition: all ease-in $an-23;
}

.queued-item-leave-active {
  position: absolute;
  transition: all ease-out $an-13;
}

.slide-from-top-enter, .slide-from-top-leave-to {
  transform: translateY(-100%);
}
</style>
