<template>
  <div class="root">
    <div class="box cus">
      <div class="title is-centered" style="color:red">Available class</div>
      <div class="box">
        <table class="table is-fullwidth is-hoverable is-striped is-centered">
          <thead>
            <tr>
              <th>No</th>
              <th>Class Date</th>
              <th>Class Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d,index) in data" v-bind:key="index">
              <td>{{index+1}}</td>
              <td>{{d.date.substring(0,d.date.indexOf('T'))}}</td>
              <td>{{d.name}}</td>
              <td>
                <router-link :to="{ name: 'Detect', params: {id: d.id }}">
                  <a class="button is-success">Enter</a>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.fetchdata();
  },
  data() {
    return {
      data: []
    };
  },
  methods: {
    fetchdata() {
      axios
        .get("/api/class")
        .then(data => {
          this.data = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cus {
  text-align: center;
  width: 60%;
}
</style>
