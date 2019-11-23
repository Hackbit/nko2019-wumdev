<template>
  <div class="container">
    <h1 class="text-6xl font-display z-10 top-0 inset-x-0 fixed w-full bg-gray-900" ref="title">BotChat</h1>
    <div class="w-full messages self-end flex-grow flex flex-col inset-x-0" ref="messages">
      <bot-message>Hello World</bot-message>
      <user-message>Check this out!</user-message>
    </div>
    <div class='flex p-2 bg-gray-900 w-full inset-x-0 z-10 fixed bottom-0 justify-center align-center'>
      <input @keydown.enter="createMessage" v-model="message" class="font-sans form-input block flex-grow bg-gray-300 mb-2 outline-none border text-blue-900 rounded-l-lg" placeholder="Type a message" />
      <button @click="createMessage" class='rounded-r-lg px-3 py-2 bg-gray-500 text-black hover:bg-gray-600 mb-2 outline-none font-sans'>Send</button>
    </div>
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
        if (this.message.length > 0){
          let newMessage = new Message();
          newMessage.$slots.default = [ this.message ];
          newMessage.$mount();
          this.$refs['messages'].appendChild(newMessage.$el);
          this.message = '';
          window.scrollTo(0, document.body.scrollHeight);
        }
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
    width: 100%;
    padding: 8px;
  }
  .messages {
    margin-top: 128px;
    margin-bottom: 64px;
    padding-left: 36px;
    padding-right: 36px;
  }
</style>
