<template>
  <div class="root">
    <router-link to="/students"><a class="button is-primary is-large is-outlined">Students Section</a></router-link>
    <router-link to="/teachers"><a class="button is-success is-large is-outlined">Teachers Section</a></router-link>
  </div>
</template>

<script>
/* eslint-disable */
export default {};
</script>


<style lang="scss" scoped>
.root {
    height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .button{
      margin: 20px;
  }
}
</style>




