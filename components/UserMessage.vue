<template>
  <div class="bg-green-700 text-gray-100 message self-end tri-right right-top rounded-lg font-sans animated fadeInUp">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'user-message'
  };
</script>

<style>
  .message {
    position: relative;
    padding: 6px 12px 6px;
    margin-bottom: 8px;
    animation-duration: 0.5s;
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
