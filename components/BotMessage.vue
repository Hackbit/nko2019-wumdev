<template>
  <div class="bg-gray-400 text-black message self-start tri-right left-top rounded-lg font-sans animated fadeInUp">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'bot-message'
  };
</script>

<style>
  .message {
    width: fit-content;
    position: relative;
    padding: 6px 12px 6px;
    margin-bottom: 8px;
    animation-duration: 0.5s;
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
