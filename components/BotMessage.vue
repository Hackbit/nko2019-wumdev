<template>
  <div class="self-start font-sans animated fadeInUp">
    <div class="text-left text-gray-600 text-xs">{{ date }}</div>
    <div class="bg-gray-400 text-black message tri-right left-top rounded-lg"><slot></slot></div>
  </div>
</template>

<script>
  export default {
    name: 'bot-message',
    data() {
      return {
        date: this.timeSince(new Date())
      };
    },
    methods: {
      timeSince(timeStamp) {
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
  .animated {
    animation-duration: 0.5s;
  }
  .message {
    width: fit-content;
    position: relative;
    padding: 6px 12px 6px;
    margin-bottom: 8px;
  }
  .tri-right.left-top:after{
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: -12px;
    right: auto;
    top: 0;
    bottom: auto;
    border: 16px solid;
    border-color: #CBD5E0 transparent transparent transparent;
  }
</style>
