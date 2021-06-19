<template>
  <div class="root">
    <video class="videocontainer" autoplay></video>
    <div id="prediction"></div>
    <div id="action" class="buttons" style="display: none">
      <span id="submit" class="button is-success">Submit</span>
      <span id="retry" class="button is-info">Retry</span>
    </div>
    <div id="imagecontainer"></div>
  </div>
</template>

<script>
import * as faceapi from "face-api.js";
import axios from "axios";
import JQuery from "jquery";
let $ = JQuery;
var trainedmodel = null;
var pause = false;
var classes = [];
var map = new Map();
var room;
var stream;

function getimageUri(className, idx) {
  return `models/${className}/${className}${idx}.png`;
}
async function onPlay(video) {
  if (!room) {
    location.replace("/");
  }
  if (!pause) {
    console.log("change");
    $("#prediction").val("");
    var can = await faceapi.createCanvasFromMedia(video);
    var minconfidence = 0.5;
    const detections = await faceapi.detectAllFaces(can);
    const faceImages = await faceapi.extractFaces(can, detections);
    $("#imagecontainer").empty();
    faceImages.forEach(async canvas => {
      $("#imagecontainer").append(canvas);
      const descriptor = await faceapi.computeFaceDescriptor(canvas);
      const bestMatch = trainedmodel.findBestMatch(descriptor);
      $("#prediction").html(
        `<div class="title">Identified as: <span style="color:red">"${bestMatch.toString()}"</span></div>`
      );
      if (!bestMatch.toString().includes("unknown")) {
        pause = true;
        $("#action").show();
        $("#submit").click(function() {
          console.log("alpha");
          stream.getTracks().forEach(track => track.stop());
          location.replace(
            "#/result?name=" + bestMatch.toString() + "&class=" + room
          );
        });
        $("#retry").click(function() {
          pause = false;
          $("#imagecontainer").empty();
          $("#action").hide();
          // onPlay(video);
        });
      }
    });
  }
  setTimeout(() => onPlay(video), 2000);
}

// async function uploadimage() {
//   const imgFile = $("#uploadimage").get(0).files[0];
//   const img = await faceapi.bufferToImage(imgFile);
//   $(".videocontainer").append(img);
//   let inputSize = 512;
//   let scoreThreshold = 0.5;
//   // await faceapi.nets.tinyFaceDetector.load("/");
//   await faceapi.nets.ssdMobilenetv1.load("/");

//   const inputimage = img;
//   const detections = await faceapi.detectAllFaces(
//     inputimage,
//     new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
//   );
//   const faceImages = await faceapi.extractFaces(inputimage, detections);
//   $(".videocontainer").empty();
//   faceImages.forEach(async canvas => {
//     $(".videocontainer").append(canvas);
//     const descriptor = await faceapi.computeFaceDescriptor(canvas);
//     const bestMatch = trainedmodel.findBestMatch(descriptor);
//     $("#prediction").val(bestMatch.toString());

//   });
// }

async function trianmodel() {
  const maxDescriptorDistance = 0.6;
  const labeledFaceDescriptors = await Promise.all(
    classes.map(async className => {
      const descriptors = [];
      var data = map.get(className);
      for (var t of data) {
        console.log(t.url);
        const img = await faceapi.fetchImage(t.url);
        descriptors.push(await faceapi.computeFaceDescriptor(img));
      }
      return new faceapi.LabeledFaceDescriptors(className, descriptors);
    })
  );

  return new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
}
async function init() {
  stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  const videoEl = $(".videocontainer").get(0);
  videoEl.srcObject = stream;
  await faceapi.loadFaceRecognitionModel("/weights");
  await faceapi.nets.ssdMobilenetv1.load("/weights");
  trainedmodel = await trianmodel();
  onPlay(videoEl);
}
export default {
  props: ["id"],
  mounted() {
    // init();
    room = this.id;
    (classes = []),
      axios
        .get("/api/students")
        .then(data => {
          for (var d of data.data) {
            classes.push(d.name);
          }

          classes.map(async className => {
            axios
              .get("/api/images/" + className)
              .then(async data => {
                var urls = data.data;
                map.set(className, urls);
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                console.log(map.size);
                console.log(map);
                console.log(classes.length);
                console.log(classes);

                if (map.size == classes.length) {
                  init();
                }
              });
          });
        })
        .catch(err => {
          console.log(err);
        });
  },

  methods: {
    async init() {
      await faceapi.loadFaceRecognitionModel("/weights");
    }
  }
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>
