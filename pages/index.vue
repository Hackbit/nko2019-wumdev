<template>
  <div class="container">
    <h1 class="text-6xl font-display z-10 top-0 fixed w-full bg-black" ref="title">BotChat</h1>
    <div class="w-full messages self-end flex-grow flex flex-col" ref="messages">
      <bot-message>Hello World</bot-message>
      <user-message>Check this out!</user-message>
    </div>
    <input autofocus type="text" v-model="message" placeholder="Enter your message!" class="z-10 inset-x-0 bottom-0 fixed border bg-black w-full my-1 text-gray-300 text-right px-4 rounded-lg outline-none" @keydown.enter="createMessage" />
  </div>
</template>

<script>
  import BotMessage from '../components/BotMessage';
  import Vue from 'vue';
  import UserMessage from '../components/UserMessage';
  let Message = Vue.extend(UserMessage);

  export default {
    components: { UserMessage, BotMessage },
    data() {
      return {message: ''}
    },
    methods: {
      createMessage() {
        let newMessage = new Message();
        newMessage.$slots.default = [ this.message ];
        newMessage.$mount();
        this.$refs.messages.appendChild(newMessage.$el);
        this.message = '';
      }
    }
  }
</script>

<style>
  input {
    padding: 4px;
  }
  .container {
    @apply min-h-screen flex items-center text-center mx-6 flex-col;
    max-width: 90%;
  }
  .messages {
    margin-top: 128px;
    margin-bottom: 64px;
    padding-left: 36px;
    padding-right: 36px;
  }
</style>
