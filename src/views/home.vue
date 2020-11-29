<template>
  <div id="app">
      home
  </div>
</template>
<script type="module">
export default {
  
  mounted() {
    console.log(12345)
    this.$http.get(`/home`)
  }
}
</script>

<style>

</style>
