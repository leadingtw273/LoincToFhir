<template>
  <v-sheet height="318px" class="mt-2 pa-2 overflow-y-auto" v-chat-scroll>
    <div
      :class="['mb-1', color]"
      v-for="{ text, color, id } in logList"
      :key="id"
    >
      <v-divider v-if="text === '---'"></v-divider>
      <span v-else>{{ text }}</span>
    </div>
  </v-sheet>
</template>

<script>
import uuid from 'uuid';

export default {
  name: 'TheLogSheet',
  props: [],
  data() {
    return {
      logList: [],
    };
  },
  methods: {
    print(text, color = '#FFFFFF') {
      this.logList.push({
        text,
        color: color + '--text',
        id: this.getRandomKey(),
      });
    },
    line() {
      this.logList.push({
        text: '---',
        color: '#FFFFFF',
        id: this.getRandomKey(),
      });
    },
    getRandomKey() {
      return uuid.v4();
    },
    clear() {
      this.logList = [];
    },
  },
};
</script>
