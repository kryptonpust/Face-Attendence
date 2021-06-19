<template>
  <div>
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
            <a class="button is-danger" @click="del(d.id)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
    <a class="button is-fullwidth is-medium is-success" @click="add">Add New Class</a>
    <div class="modal is-active" v-if="showmodal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <div class="field">
            <label class="label">Enter class Name</label>
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Class Name"
                v-model="classname"
                autofocus
              >
            </p>
          </div>
          <a type="submit" class="button is-success" @click="submit">Save</a>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="showmodal=false"></button>
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
      data: [],
      showmodal: false,
      classname: ""
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
    },
    add() {
      this.classname = "";
      this.showmodal = true;
    },
    submit() {
      if (this.classname != "") {
        axios
          .post("/api/class", {
            name: this.classname
          })
          .then(data => {
            console.log(data.data);
            (this.classname = ""), (this.showmodal = false);
            this.fetchdata();
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    del(x) {
      axios
        .post("/api/deleteclass", { id: x })
        .then(data => {
          console.log(data.data);
          this.fetchdata();
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
