<template>
  <v-list>
    <v-list-item v-for="(msg, i) in messages" :key="i" two-line>
      <v-list-item-title class="font-weight-bold">
        {{ msg.author }}{{ msg.specialization ? ' (' + msg.specialization + ')' : '' }}
      </v-list-item-title>
      <v-list-item-subtitle>{{ msg.content }}</v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ messages: Array })
</script>
