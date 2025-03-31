<template>
  <div id="app">
    <h1>Translator tool</h1>
    <TextTranslator />
  </div>
  <footer>By @Trung Nguyen</footer>
</template>

<script lang="ts" setup>
import TextTranslator from './components/TextTranslator.vue'
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 10px; */
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

footer {
  margin-top: 30px;
  font-size: 14px;
  color: #7f8c8d;
}
</style>
