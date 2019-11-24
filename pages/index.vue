<template>
  <div class="container">
    <h1 class="text-6xl font-display z-10 top-0 inset-x-0 fixed w-full bg-gray-900" ref="title">BotChat</h1>
    <div class="w-full messages self-end flex-grow flex flex-col" id="messages" ref="messages">
      <sys-message>Welcome! This is botchat, a place where you can interact with our bot or people in the room real-time! To chat with the bot, you message should start with <code class="bg-yellow-300 text-red-800 font-sans">&nbsp;@bot </code>. To chat with others, any normal messages are fine.</sys-message>
      <sys-message>This was made by WumDev for Node Knockout 2019. We would greatly appreciate it if you <a class="font-bold hover:text-black" href="http://www.nodeknockout.com/entries/84-wumdev/vote" target="_blank">up-vote</a> it. We currently have <span class="font-bold">{{ upvotes }} votes</span>.</sys-message>
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
  import SysMessage from '../components/SysMessage';

  let MyMessage = Vue.extend(UserMessage);
  let OtherMessage = Vue.extend(BotMessage);
  let Log = Vue.extend(SysMessage);
  let username = '';

  while (username === '') {
    username = prompt('Please enter your username!');
  }
  let id = '', init = false;

  let client = io('https://hackbit-nko2019-wumdev.glitch.me/');

  client.on('connect', () => {
    window.localStorage.setItem('username', username);
    client.emit('data', {username});

    client.on('clientData', data => {
      if (!init) {
        window.localStorage.setItem('id', data['id'].toString());
        id = data['id'].toString();
        init = true;
      }
    });

    client.on('err', ({code})=> {
      init = false;
      if (code === 0) {
        username = prompt('Invalid username provided. Please re-enter a valid username!');
        client.emit('data', {username});
      }
      if (code === 1) {
        username = prompt('Username already in use. Please enter a new username!');
        client.emit('data', {username})
      }
    });

    client.on('userJoin', username => {
      let newLog = new Log();
      newLog.$slots.default = [`${username} just joined the party!`];
      newLog.$mount();
      document.getElementById('messages').appendChild(newLog.$el);
      setTimeout(()=>{window.scrollTo(0, document.body.scrollHeight);}, 1100);
    });

    client.on('userDisconnect', username => {
      let newLog = new Log();
      newLog.$slots.default = [`${username} just left the chat!`];
      newLog.$mount();
      document.getElementById('messages').appendChild(newLog.$el);
      setTimeout(()=>{window.scrollTo(0, document.body.scrollHeight);}, 1100);
    });

    client.on('userMessage', ({message, by, id}) => {
      let newMessage = new OtherMessage({propsData: {username: by, id: id.toString()}});
      newMessage.$slots.default = [ message ];
      newMessage.$mount();
      document.getElementById('messages').appendChild(newMessage.$el);
      setTimeout(()=>{window.scrollTo(0, document.body.scrollHeight);}, 1100);
    });
  });

  export default {
    components: { SysMessage, UserMessage, BotMessage },
    data() {
      return {message: '', upvotes: 0}
    },
    created() {
      fetch('http://www.nodeknockout.com/entries/84-wumdev/vote/stats').then(res=>res.json()).then(data => {
        this.upvotes = data['vote_count'];
      });
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
