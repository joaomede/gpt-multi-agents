<template>
  <v-list>
    <v-list-item v-for="(msg, i) in messages" :key="i">
      <strong>{{ msg.author }} {{ msg.specialization ? '(' + msg.specialization + ')' : '' }}:</strong>
      {{ msg.content }}
    </v-list-item>
  </v-list>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ messages: Array })
</script>
