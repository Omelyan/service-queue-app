<template>
  <li>
    <div :class="['countdown', { 'status': label }]">
      <span class="symbol" @animationend="$emit('update:symbol', 0)" v-if="symbol && !label">{{ String.fromCharCode(symbol) }}</span><!--

   --><span :class="['label', state]" v-if="label">{{ label }}</span><!--

   --><span :class="['timer', { blinking }]" @animationend="$emit('update:blinking', false)" v-else>
        <span class="deadline" v-if="left > 60">
          <span class="hours">{{ deadlineHours }}</span><!--

       --><span class="minutes"><span class="colon" />{{ deadlineMinutes }}</span>
        </span><!--

     --><span v-else>
          <span class="hours" v-if="hours">{{ hours }}</span><!--

       --><span class="minutes" v-if="minutes"><span class="colon" v-if="hours" />{{ String('0' + minutes).slice(-2) }}</span><!--

       --><span class="units" v-if="!(hours * minutes)">&thinsp;{{ units }}</span>
        </span>
      </span>
    </div><!--

 --><div :class="['plate md-elevation-6', { swinging }]" @animationend="$emit('update:swinging', false)">{{ plate }}</div>
  </li>
</template>

<script>
export default {
  props: {
    state: String,
    symbol: Number,
    swinging: Boolean,
    blinking: Boolean,
    deadline: { type: Date, required: true },
    left: { type: Number, required: true },
    plate: { type: String, required: true }
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
    },

    deadlineHours () {
      return String('0' + this.deadline.getHours()).slice(-2)
    },

    deadlineMinutes () {
      return String('0' + this.deadline.getMinutes()).slice(-2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.countdown {
  flex: 0 0 36%;
  display: flex;
  align-items: baseline;
  padding: 0 $pa-23;

  &.status {
    align-self: center;
    .label {
      word-break: break-word;
      text-transform: lowercase;
      &.success, &.error {
        margin-left: -$pa-23;
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
    span {
      display: inline-block;
    }

    .hours, .minutes {
      font-size: $fs-53;
    }

    .colon {
      &::before {
        content: ":";
      }

      vertical-align: .07ch;
      animation: blinking $an-1 ease 300;
    }

    .units {
      font-weight: lighter;
    }

    .deadline {
      color: white;
    }

    color: var(--v-error-lighten5);
  }
}

.plate {
  font-size: $fs-2;
  line-height: 90%;
  word-break: break-word;
  margin-right: $ma-14;
  padding: $pa-17 $pa-13 $pa-16;
  border-radius: $pa-10;
  color: #333;
  background-color: white;
  text-transform: uppercase;
}

.queued-item-enter-active {
  .swinging {
    animation-play-state: paused;
  }
}

$swings: 8;
$swinging-degree: 12deg;

.swinging {
  animation: swinging $an-1 * $swings cubic-bezier(0.45, 0.05, 0.55, 0.95);
  animation-play-state: paused;
}

.on .swinging {
  animation-play-state: running;
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
