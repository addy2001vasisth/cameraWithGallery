// const shortid = require("shortid");

let video = document.querySelector("video");
let recorder;
let transcolor = "orignal";
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;

let chunks = []; // media data in small parts
let constraints = {
  video: true,
  audio: true,
};

// global object which tell browser info
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chunks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  recorder.addEventListener("stop", (e) => {
    // conversion of video chunk into video
    let blob = new Blob(chunks, { type: "video/mp4" });
    if(db){
      let videoid = shortid();
      let dbTransaction = db.transaction("video",'readwrite');
      let videoStore = dbTransaction.objectStore('video')
      let videoEntry = {
        id: `vid-${videoid}`,
        blobData : blob
      }
      videoStore.add(videoEntry);


    }
    // let a = document.createElement("a");
    // a.href = videoUrl;
    // a.download = "stream.mp4";
    // a.click();
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) return;
  recordFlag = !recordFlag;
  if (recordFlag) {
    //start
    recorder.start();

    recordBtn.classList.add("scale-record");
    startTimer();
  } else {
    //stop
    recorder.stop();

    recordBtn.classList.remove("scale-record");
    stopTimer();
  }
});

captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add('scale-capture');
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let tool = canvas.getContext("2d");
  tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  tool.fillStyle = transcolor;
  tool.fillRect(0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL();
  // let a = document.createElement("a");
  // a.href = image_data_url;
  // a.download = "image.jpg";
  // a.click();
  // // data url of the image
  // console.log(image_data_url);
  if(db){
    let imageid = shortid();
    let dbTransaction = db.transaction("image",'readwrite');
    let imagestore = dbTransaction.objectStore('image')
    let imageEntry = {
      id: `img-${imageid}`,
      url : image_data_url
    }
    imagestore.add(imageEntry);


  }
  setTimeout(()=>{
    captureBtn.classList.remove('scale-capture')

  },500)
});
let timer_id;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
  timer.style.display = "block";
  function displayTimer() {
    let bal = counter;
    let hrs = Number.parseInt(bal / 3600);
    bal = bal % 3600;
    let min = Number.parseInt(bal / 60);
    bal = bal % 60;
    let sec = bal;
    hrs = hrs < 10 ? `0${hrs}` : hrs;
    min = min < 10 ? `0${min}` : min;
    sec = sec < 10 ? `0${sec}` : sec;
    timer.innerText = `${hrs}:${min}:${sec}`;
    counter++;
  }
  timer_id = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timer_id);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
}

//filtering
let filterLayer = document.querySelector(".filter-layer");

let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", (e) => {
    transcolor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
      filterLayer.style.backgroundColor = transcolor;
  });
});
