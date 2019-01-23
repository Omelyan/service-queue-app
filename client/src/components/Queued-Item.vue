<template>
  <li>
    <div class="countdown">
      <span class="label"></span><!--
   --><span class="symbol">↑</span><!--
   --><span class="timer">
        <span class="hours">{{ Math.floor(item.left / 60) }}:</span><!--
     --><span class="minutes">{{ item.left % 60 }}&thinsp;</span><!--
     --><span class="units">{{ units }}</span>
      </span>
    </div><!--
 --><div class="plate md-elevation-7">{{ item.plate }}</div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    units () {
      return 'хв'
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

  .symbol {
    margin-right: $ma-14;
    align-self: center;
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
  animation: swinging $an-1 * $swings cubic-bezier(0.45, 0.05, 0.55, 0.95) $an-23 1;
}

@keyframes swinging {
  @for $i from 1 through 2 * $swings - 1 {
    #{100% / $swings * $i / 2} {
      transform: rotateY($swinging-degree * (2 * $swings - $i) / (2 * $swings - 1) * ($i % 2 * 2 - 1));
    }
  }
}
</style>
