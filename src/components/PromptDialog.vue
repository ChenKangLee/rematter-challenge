<template>
  <q-card class="q-pa-lg" flat bordered style="width: 800px; max-width: 80vw">
    <q-card-section>
      <div class="text-h6">Create a new capture</div>
      <div class="text-caption text-italic">
        Try to get the document to cover the whole viewport, under ample
        lighting for best results
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter">
        <q-responsive :ratio="1.77" class="col">
          <div class="col-12" style="text-align: center">
            <video
              ref="video"
              autoplay
              playsinline
              webkit-playsinline
              muted
              hidden
            ></video>
            <canvas
              width="1280"
              height="720"
              ref="canvas"
              class="viewport fit rounded-borders"
            ></canvas>
            <canvas
              width="1124"
              height="680"
              ref="canvasHidden"
              hidden
            ></canvas>
          </div>
        </q-responsive>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="bg-white q-mt-lg">
      <q-btn v-close-popup no-caps unelevated outline label="Cancel" />
      <q-btn
        v-close-popup
        no-caps
        unelevated
        :loading="loader"
        :disable="loader"
        color="primary"
        label="Capture"
        @click="onCapture"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import cv from "@techstark/opencv-js";
import useImgProcessing from "../composable/useImageProcessing";

export default {
  emits: ["onCapture"],
  setup(props, { emit }) {
    const { openCVProcessing } = useImgProcessing();

    const video = ref(null);
    const canvas = ref(null);
    const context = ref(false);
    const frameTimer = ref(null);
    const canvasHidden = ref(null);

    const constraints = ref({
      audio: false,
      video: {
        width: { min: 1280, ideal: 1280, max: 1920 },
        height: { min: 720, ideal: 720, max: 1080 },
      },
    });

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    const drawFrame = () => {
      context.value.drawImage(
        video.value,
        0,
        0,
        canvas.value.width,
        canvas.value.height,
      );
    };

    onMounted(async () => {
      if (video.value && canvas.value) {
        context.value = canvas.value.getContext("2d");

        await navigator.mediaDevices
          .getUserMedia(constraints.value)
          .then((stream) => {
            video.value.srcObject = stream;
            video.value.play();

            // register drawFrame to run periodically
            frameTimer.value = window.setInterval(() => {
              drawFrame();
            }, 1000 / 30);
          })
          .catch((e) => {
            console.error(e);
          });
      }
    });

    onBeforeUnmount(async () => {
      // stop rendering to viewport
      clearInterval(frameTimer.value);

      // stop webcam
      if (video.value)
        video.value.srcObject.getTracks().forEach((track) => track.stop());
    });

    const onCapture = () => {
      if (canvas.value) {
        const imgOriUrl = canvas.value.toDataURL("image/png");
        let mat = cv.matFromImageData(
          // get image within the border box
          context.value.getImageData(
            0,
            0,
            canvas.value.width,
            canvas.value.height,
          ),
        );

        // here the image is in Mat format, we need to submit the processing job here
        const resMat = openCVProcessing(mat);

        // we needed to output to a hidden canvas on DOM just to get the base64 representation :((
        cv.imshow(canvasHidden.value, resMat);
        const imgProcessedUrl = canvasHidden.value.toDataURL("image/png");

        const captureInfo = {
          date: new Date().toLocaleString("en-US", { timeZoneName: "short" }),
          imgOriginal: imgOriUrl,
          imgProcessed: imgProcessedUrl,
        };

        emit("onCapture", captureInfo);
      }
    };

    return {
      loader: ref(false),
      onCapture,
      video,
      canvas,
      canvasHidden,
    };
  },
};
</script>
