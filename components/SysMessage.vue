<template>
  <div class="self-center font-mono animated fadeInUp flex flex-col">
    <div class="text-center text-gray-600 text-xs">{{ date }}</div>
    <div class="self-center message rounded-lg bg-red-600 text-gray-100"><slot></slot></div>
  </div>
</template>

<script>
  export default {
    name: 'sys-message',
    data() {
      return {
        date: this.timeSince(new Date()),
      };
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
    padding: 2px 12px 2px;
    margin-bottom: 8px;
  }
</style>
