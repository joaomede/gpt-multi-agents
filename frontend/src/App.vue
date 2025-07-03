<template>
  <v-app class="fill-height d-flex flex-column">
    <h1 class="my-2">GPT Multi Agents Chatroom</h1>
    <ChatRoom class="flex-grow-1" />
  </v-app>
</template>

<script setup>
import ChatRoom from './components/ChatRoom.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 2rem;
}
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
