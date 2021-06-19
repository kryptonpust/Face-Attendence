<template>
  <div class="root">
    <video class="videocontainer" autoplay muted></video>
    <canvas style="display:none;"></canvas>
    <div class="actionclass">
      <button id="takepicture" class="button is-solid is-medium is-primary">Take a Picture</button>
    </div>
    <div class="facecontainer"></div>

    <div class="field has-addons">
      <div class="control">
        <div id="warning" style="color:red;display:none">(This field is required!)</div>
        <input id="name" type="text" placeholder="Model name">
      </div>
      <div class="control">
        <a class="button is-info" id="generate">Generate Face model</a>
      </div>
    </div>
  </div>
</template>

<script>
import * as faceapi from "face-api.js";
import JQuery from "jquery";
import axios from 'axios';
let $ = JQuery;
var stream;
async function extract(img) {
  let inputSize = 512;
  let scoreThreshold = 0.5;
  // await faceapi.nets.tinyFaceDetector.load("/");
  const inputimage = img;
  await faceapi.nets.ssdMobilenetv1.load("/weights");
  const detections = await faceapi.detectAllFaces(img);
  // const detections = await faceapi.detectAllFaces(
  //   inputimage,
  //   new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  // );
  // console.log(detections);
  const faceImages = await faceapi.extractFaces(inputimage, detections);

  // $("#facesContainer").empty();
  faceImages.forEach(canvas => $(".facecontainer").append(canvas));
}
// async function uploadimage() {
//   const imgFile = $("#uploadimage").get(0).files[0];
//   const img = await faceapi.bufferToImage(imgFile);
//   $(".videocontainer").append(img);
//   extract(img);
// }

async function init() {
  stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  const videoEl = $(".videocontainer").get(0);
  videoEl.srcObject = stream;
  $("#takepicture").click(async function() {
    const video = $("video").get(0);
    extract(await faceapi.createCanvasFromMedia(video));
    // const canvas = $("canvas").get(0);
    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;
    // canvas.getContext("2d").drawImage(video, 0, 0);
    // extract(canvas);
    // Other browsers will fall back to image/png
    // img.src = canvas.toDataURL("image/webp");
  });
}
function start() {
  init();
  $("#generate").click(function() {
    var name = $("#name").val();
    $("#warning").hide();
    if (name == "") {
      $("#warning").show();
    } else {
      // var canvas = document.getElementById('canv');
      // var dataURL = canvas.toDataURL();
      var data = [];
      $(".facecontainer > canvas").each(function(index, ele) {
        data.push(
          $(".facecontainer > canvas")
            .get(index)
            .toDataURL()
        );
      });
      // console.log({ "name": name,"imgs":data});
      axios
          .post("/upload", { name: name, imgs: data })
          .then(data => {
            console.log(data.data);
            location.replace("/");
          })
          .catch(err => {
            console.log(err);
          });
      // $.ajax({
      //   type: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   url: "/upload",
      //   data: JSON.stringify({ name: name, imgs: data })
      // },function(data,status){
      //   console.log("fail")
      // }).done(function(msg) {
      //   console.log("Success")
      // });
    }
  });
}
export default {
  mounted() {
    start();
  },
  beforeDestroy() {
    stream.getTracks().forEach(track => track.stop());
  }
};
</script>


<style lang="scss" scoped>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
