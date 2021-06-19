<template>
  <div>
    <table class="table is-fullwidth is-hoverable is-striped is-centered">
      <thead>
        <tr>
          <th>Name</th>
          <th v-for="(data,index) in classdata" v-bind:key="index">{{data.date.substring(0,data.date.indexOf('T'))}}</th>
          <th>Total present</th>
          <th>Total Class</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        <present-component v-for="(d,index) in studentdata" v-bind:key="index" :class-data="classdata" :id="d.id" :name="d.name"></present-component>
      </tbody>
    </table>
  </div>
</template>

<script>
import PresentComponent from './PresentComponent.vue' 
import axios from "axios";
export default {
    components:{PresentComponent},
    mounted(){
        this.fetchclass();
        this.fetchstudents();
    },
    data(){
        return{
            classdata:[],
            studentdata:[],
        }
    },
  methods: {
    fetchclass() {
      axios
        .get("/api/class")
        .then(data => {
          this.classdata = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchstudents()
    {
         axios
        .get("/api/students")
        .then(data => {
          this.studentdata = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
