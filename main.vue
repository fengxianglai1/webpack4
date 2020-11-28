<template>
  <div id="app">
      12347777777
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
