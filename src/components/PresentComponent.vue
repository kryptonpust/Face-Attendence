<template>
  <tr>
      <td>{{name}}</td>
      <td class="is-centered" v-for="(data,index) in classes" v-bind:key="'td'+index">
          <div v-if="data.present"><i class="fas fa-check-circle" style="color:green"></i></div>
          <div v-else><i class="fas fa-times-circle" style="color:red"></i></div>
      </td>
      <td>{{totalpresent}}</td>
      <td>{{totalclass}}</td>
      <td>{{((totalpresent/totalclass)*100).toPrecision(2)}}%</td>
  </tr>
</template>

<script>
import axios from "axios";
export default {
  props: ["ClassData", "id","name"],
  mounted() {
    this.classes=JSON.parse(JSON.stringify(this.ClassData));
    this.fetchpresent();
  },
  data() {
    return {
      classes: [],
      totalpresent: 0,
      totalclass:39,
    };
  },
  methods: {
    fetchpresent() {
      axios
        .get("/api/present/" + this.id)
        .then(data => {
          var present = data.data;
          this.classes.forEach(element => {
            present.forEach(el => {
              if (element.id == el.class_id) {
                  this.totalpresent++;
                  element['present']=1;
                  this.$forceUpdate();
              }
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
