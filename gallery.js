setTimeout(() => {
  if (db) {
    // videos retreival
    let videodbTransaction = db.transaction("video", "readonly");
    let videoStore = videodbTransaction.objectStore("video");

    let videoReq = videoStore.getAll(); // event driven
    videoReq.onsuccess = (e) => {
      let videoResult = videoReq.result;
      let galleryCont = document.querySelector(".gallery-cont");

      videoResult.forEach((videoObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);
        mediaElem.innerHTML = `<div class="media">
        <video autoplay loop src="${url}"></video>
    </div>
    <div class="download action-btn">DOWNLOAD</div>
    <div class="delete action-btn">DELETE</div>`;
        galleryCont.appendChild(mediaElem);

        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteFunc);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadFunc);
      });
    };

    // images retrieval

    let imagedbTransaction = db.transaction("image", "readonly");
    let imageStore = imagedbTransaction.objectStore("image");

    let imageReq = imageStore.getAll(); // event driven
    imageReq.onsuccess = (e) => {
      let imageResult = imageReq.result;
      let galleryCont = document.querySelector(".gallery-cont");

      imageResult.forEach((imageObj) => {
        let mediaElem = document.createElement("div");
        mediaElem.setAttribute("class", "media-cont");
        mediaElem.setAttribute("id", imageObj.id);
        let url = imageObj.url;
        mediaElem.innerHTML = `
        <div class="media">
            <img src = "${url}" />
        </div>
        <div class="download action-btn">DOWNLOAD</div>
        <div class="delete action-btn">DELETE</div>
        `;
        galleryCont.appendChild(mediaElem);

        let deleteBtn = mediaElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteFunc);
        let downloadBtn = mediaElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadFunc);
      });
    };
  }
}, 100);

// UI + db remove
function deleteFunc(e) {
  // db removal
  let id = e.target.parentElement.getAttribute("id");
  if (id.slice(0, 3) == "vid") {
    let videodbTransaction = db.transaction("video", "readwrite");
    let videoStore = videodbTransaction.objectStore("video");
    videoStore.delete(id);
  } else if (id.slice(0, 3) == "img") {
    let imagedbTransaction = db.transaction("image", "readwrite");
    let imageStore = imagedbTransaction.objectStore("image");
    imageStore.delete(id);
  }

  // UI removal
  e.target.parentElement.remove();
}

function downloadFunc(e) {
  let id = e.target.parentElement.getAttribute("id");
  if (id.slice(0, 3) == "vid") {
    let videodbTransaction = db.transaction("video", "readwrite");
    let videoStore = videodbTransaction.objectStore("video");
    let videoReq = videoStore.get(id);
    videoReq.onsuccess = (e) => {
      let videoResult = videoReq.result;
      let videoUrl = URL.createObjectURL(videoResult.blobData);
      let a = document.createElement("a");
      a.href = videoUrl;
      a.download = "videoplayback.mp4";
      a.click();
    };
  } else if (id.slice(0, 3) == "img") {
    let imagedbTransaction = db.transaction("image", "readwrite");
    let imageStore = imagedbTransaction.objectStore("image");
    let imageReq = imageStore.get(id);
    imageReq.onsuccess = (e) => {
      let imageResult = imageReq.result;
      let a = document.createElement("a");
      a.href = imageResult.url;
      a.download = "image.jpg";
      a.click();
    };
  }
}
