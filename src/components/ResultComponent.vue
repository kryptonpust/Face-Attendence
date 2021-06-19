<template>
  <div class="root">
    <div class="box cus">
      <div class="title is-centered" style="color:red">Message</div>
      <div class="box">
        <div class="title">{{msg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.name = this.$route.query.name;
    this.cid = this.$route.query.class;
    this.fetchdata();
  },
  data() {
    return {
      name: "",
      cid: null,
      id: null,
      msg: null,
    };
  },
  methods: {
    fetchdata() {
      axios
        .get("/api/students")
        .then(data => {
          var test = data.data;
          console.log(test);
          for (var s of test) {
            if (this.name.includes(s.name)) {
              this.id = s.id;
            }
          }
          this.upload();
        })
        .catch(err => {
          console.log(err);
        });
    },
    upload() {
      axios
        .post("/api/result", { cid: this.cid, sid: this.id })
        .then(data => {
          console.log(data.data);
          this.msg=data.data.message;
          setTimeout(() => {
            location.replace("/");
          }, 5000);
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
