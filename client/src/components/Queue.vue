<template>
  <v-app id="queue" dark>
    <v-content>
      <div id="queue-list-wrapper" v-if="queue.length">
        <transition-group name="sliding" @after-enter="afterEnter" tag="ul">
          <queued-item
          class="queued-item"
          v-for="item in queue"
          :key="item.cid"
          :item="item"
          />
        </transition-group>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import QueuedItem from './Queued-Item'

export default {
  components: {
    QueuedItem
  },

  data () {
    return {
      queue: [
        {cid: 1001, left: '30', plate: 'AA005320IT'},
        {cid: 1002, left: '95', plate: 'AA 2230 KX'},
        {cid: 1003, left: '120', plate: 'OH 3393 AB'},
        {cid: 1004, left: '395', plate: 'GZK 0017'}
      ]
    }
  },

  methods: {
    afterEnter () {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

// Background
.v-content {
  background-image: linear-gradient(160deg,
    var(--v-primary-base) 0%,
    var(--v-secondary-base) 50%,
    var(--v-accent-base) 100%
  );
  background-size: 900% 900%;
  // animation: rainbow 60s ease-in-out infinite;
  transform-style: preserve-3d;
  perspective: 2000px;
}

@keyframes rainbow {
  50% {
    background-position: 100% 100%;
  }
}

// Queue
#queue-list-wrapper ul {
  font-size: 450%;
  line-height: 1;
  list-style-type: none;
  margin-top: 1em;
  padding: 0;
}

.queued-item {
  display: flex;
  align-items: baseline;
  width: 100%;
  margin-bottom: $ma-13;
  transition: all ease $an-1;
}

.sliding-enter, .sliding-leave-to {
  transform: translateY($ma-13);
  opacity: 0;
}

.sliding-enter-active {
  transition: all ease-in $an-23;
}

.sliding-leave-active {
  position: absolute;
  transition: all ease-out $an-13;
}
</style>
