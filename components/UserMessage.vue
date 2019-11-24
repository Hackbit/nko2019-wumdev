<template>
  <div class="self-end font-sans animated fadeInUp flex flex-col">
    <div class="text-left text-gray-600 text-xs">{{ date }}</div>
    <div class="self-end flex align-start">
      <div class="tri-right message right-top rounded-lg bg-green-700 text-gray-100"><slot></slot></div>
      <img :src="avatar" class="self-end text-xs avatar" :alt='username' :title="username"/>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['username', 'id'],
    name: 'user-message',
    data() {
      return {
        date: this.timeSince(new Date()),
        avatar: 'https://api.adorable.io/avatars/285/abott@adorable.png'
      };
    },
    created() {
      this.avatar = `https://api.adorable.io/avatars/face/eyes${this.id.split('')[0]}/nose${this.id.split('')[1]}/mouth${this.id.split('')[2]}/${this.id}`;
    },
    methods: {
      timeSince(timeStamp) {
        this.date = 'A few seconds ago';
        setInterval(() => {
          let now = new Date(),
            secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
          if (secondsPast < 60)
            this.date = 'A few seconds ago';

          else if (secondsPast < 3600)
            this.date = (parseInt(secondsPast/60)).toString() + ' minute' + (parseInt(secondsPast/60) > 1 ? 's ago' : ' ago');

          else if (secondsPast <= 86400)
            this.date = (parseInt(secondsPast / 3600)).toString() + ' hours ago';

          else {
            let day = timeStamp.getDate();
            let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
            let year = timeStamp.getFullYear() === now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
            this.date = day + " " + month + year;
          }
        }, 1000);
      }
    }
  };
</script>

<style>
  .avatar {
    height: 32px;
    width: 32px;
    margin: 0 8px 8px;
    border-radius: 50%;
  }
  .animated {
    animation-duration: 0.5s;
  }
  .message {
    position: relative;
    padding: 6px 12px 6px;
    margin-bottom: 8px;
  }
  .tri-right.right-top:after{
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    right: -12px;
    left: auto;
    top: 0;
    bottom: auto;
    border: 16px solid;
    border-color: #2F855A transparent transparent transparent;
  }
</style>
