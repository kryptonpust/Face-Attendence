<template>
  <div id="app">
    <div class="root">
      <div class="nav">
        <a class="title" href="/">Department of ICE</a>
        <search-component></search-component>
      </div>
      <div class="body">
        <div class="sidebar box">
          <img src="/pust_logo.png" alt="PUST" width="300px" height="300px">
        </div>
        <div class="custom-content">
          <div class="tabs is-fullwidth is-large">
            <ul>
              <router-link tag="li" to="/menu"><a>Menu</a></router-link>
              <router-link tag="li" to="/class"><a>Class</a></router-link>
              <router-link tag="li" to="/information"><a>Information</a></router-link>
              <router-link tag="li" to="/upload"><a>Upload</a></router-link>
            </ul>
          </div>
          <div class="box">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchComponent from './SearchComponent.vue' 
/* eslint-disable */
export default {
  name: "App",
  components:{SearchComponent}
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Great+Vibes');
.root {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  flex: 20;
  .nav {
    display: flex;
    flex: 2;
    justify-content: space-between;
    align-content: center;
    padding: 10px;
    .title{
      font-family: 'Great Vibes', cursive;
      color: tomato;
      font-weight: 600;
    }
  }
  .body {
    display: flex;
    flex: 18;
    // align-items: flex-start;
    .sidebar {
      display: flex;
      flex: 1;
      margin: 10px;
      img {
        max-width: 300px;
      }
    }
    .custom-content {
      // display: flex;
      flex-direction: column;
      flex-grow: 2;
      justify-content: flex-start;
      align-items: center;
      margin: 10px;
    }
  }
}
</style>


