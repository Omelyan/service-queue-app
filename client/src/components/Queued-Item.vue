<template>
  <li>
    <div :class="['countdown', { 'status': label }]">
      <span class="symbol" @animationend="$emit('update:symbol', 0)" v-if="symbol && !label">{{ String.fromCharCode(symbol) }}</span><!--

   --><span :class="['label', state]" v-if="label">{{ label }}</span><!--

   --><span :class="['timer', { blinking }]" @animationend="blinking = false" v-else>
        <span class="hours" v-if="hours">{{
          hours + (minutes ? ':' : '&thinsp;')
        }}</span><!--

     --><span class="minutes" v-if="minutes">{{
          String('0' + minutes).slice(-2) + (hours ? '' : '&thinsp;')
        }}</span><!--

     --><span class="units" v-if="!(hours * minutes)">{{ units }}</span>
      </span>
    </div><!--

 --><div :class="['plate md-elevation-7', { swinging }]" @animationend="swinging = false">{{ plate }}</div>
  </li>
</template>

<script>
export default {
  props: {
    state: String,
    symbol: Number,
    updated: Number,
    left: {
      type: Number,
      required: true
    },
    plate: {
      type: String,
      required: true
    }
  },

  data: function () {
    return {
      swinging: false,
      blinking: false
    }
  },

  watch: {
    updated () {
      this.blinking = this.swinging = true
    }
  },

  computed: {
    label () {
      switch (this.state) {
        case 'success':
          return 'виконано'
        case 'postponed':
          return 'відкладено'
        case 'error':
          return 'скасовано'
        default:
          return this.left < 15 ? 'завершення робіт' : null
      }
    },

    hours () {
      return Math.trunc(this.left / 60)
    },

    minutes () {
      return this.left % 60
    },

    units () {
      return this.hours ? 'год' : 'хв'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

// Item'
.countdown {
  flex: 0 0 36%;
  display: flex;
  align-items: baseline;
  padding: 0 $pa-34;

  &.status {
    align-self: center;
    .label {
      word-break: break-word;
      text-transform: lowercase;
      &.success, &.error {
        margin-left: -$pa-34;
        padding: $pa-10 $pa-12 $pa-14 $pa-13;
        clip-path: polygon(0% 0%, calc(100% - #{$pa-13}) 0%, 100% 50%, calc(100% - #{$pa-13}) 100%, 0% 100%);
      }
      &.postponed {
        opacity: .8;
      }
    }
  }

  .symbol {
    margin-right: $ma-14;
    align-self: center;
    color: var(--v-error-lighten5);
    opacity: 0;
    animation: ignition $an-2 ease calc(5 * 60 / 2);
  }

  .timer {
    > span {
      display: inline-block;
    }

    .hours, .minutes {
      font-size: $fs-53;
    }

    .units {
      font-style: italic;
      opacity: .8;
    }
  }
}

.plate {
  font-size: $fs-2;
  word-break: break-word;
  margin-right: $ma-13;
  padding: $pa-10 $pa-13;
  border-radius: $pa-10;
  color: #333;
  background-color: white;
  text-transform: uppercase;
}

// Animations
$swings: 8;
$swinging-degree: 15deg;

.swinging {
  animation: swinging $an-1 * $swings cubic-bezier(0.45, 0.05, 0.55, 0.95) 1;
}

@keyframes swinging {
  @for $i from 1 through 2 * $swings - 1 {
    #{100% / $swings * $i / 2} {
      transform: rotateY($swinging-degree * (2 * $swings - $i) / (2 * $swings - 1) * ($i % 2 * 2 - 1));
    }
  }
}

.blinking {
  animation: blinking $an-1 ease 11;
}

@keyframes blinking {
  50% { opacity: 0; }
}

@keyframes ignition {
  33% { opacity: 1; }
}

</style>
