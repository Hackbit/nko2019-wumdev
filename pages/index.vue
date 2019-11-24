<template>
  <div class="container">
    <h1 class="text-6xl font-display z-10 top-0 inset-x-0 fixed w-full bg-gray-900" ref="title">BotChat</h1>
    <div class="w-full messages self-end flex-grow flex flex-col" id="messages" ref="messages">
      <bot-message id="101" username="Bot">Hello World</bot-message>
    </div>
    <div class='flex p-2 bg-gray-900 w-full inset-x-0 z-10 fixed bottom-0 justify-center align-center'>
      <input id="messageBox" @keydown.enter="sendMessage" v-model="message" class="font-sans form-input block flex-grow bg-gray-300 mb-2 outline-none border text-blue-900 rounded-l-lg px-4" autofocus placeholder="Type a message" />
      <button @click="sendMessage" id="send" class='rounded-r-lg px-3 py-2 bg-gray-500 text-black hover:bg-gray-600 mb-2 outline-none font-sans'>Send</button>
    </div>
  </div>
</template>

<script>
  import BotMessage from '../components/BotMessage';
  import Vue from 'vue';
  import UserMessage from '../components/UserMessage';
  import io from 'socket.io-client';

  let MyMessage = Vue.extend(UserMessage);
  let OtherMessage = Vue.extend(BotMessage);
  let username = '';

  while (username === '') {
    username = prompt('Please enter your username!');
  }
  let id = '', init = false;

  let client = io('https://hackbit-nko2019-wumdev.glitch.me/');

  client.on('connect', () => {
    console.log('Connected!');
    window.localStorage.setItem('username', username);
    client.emit('data', {username});

    client.on('clientData', data => {
      if (!init) {
        window.localStorage.setItem('id', data['id'].toString());
        id = data['id'].toString();
        init = true;
      }
    });

    client.on('err', console.log);

    client.on('userMessage', ({message, by, id}) => {
      let newMessage = new OtherMessage({propsData: {username: by, id: id.toString()}});
      newMessage.$slots.default = [ message ];
      newMessage.$mount();
      document.getElementById('messages').appendChild(newMessage.$el);
      setTimeout(()=>{window.scrollTo(0, document.body.scrollHeight);}, 1100);
    });
  });

  export default {
    components: { UserMessage, BotMessage },
    data() {
      return {message: '', client}
    },
    methods: {
      sendMessage() {
        if (this.message.length > 0) {
          client.emit('message', this.message);
          let newMessage = new MyMessage({ propsData: {username, id} });
          newMessage.$slots.default = [ this.message ];
          newMessage.$mount();
          this.$refs['messages'].appendChild(newMessage.$el);
          this.message = '';
          window.scrollTo(0, document.body.scrollHeight);
          setTimeout(()=>{window.scrollTo(0, document.body.scrollHeight);}, 1100);
        }
      }
    }
  };
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
