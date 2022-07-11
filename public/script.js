const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const peer = new Peer();

var myVideoStream;
myVideo = document.createElement("video");
myVideo.muted = true;

const peers = {};

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      setTimeout(connectToNewUser, 1000, userId, stream);
    });
  })
  .catch(console.error);

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

//calling others
const connectToNewUser = (userId, stream) => {
  call = peer.call(userId, stream);
  video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

var text = $("input");

$(document).keydown((e) => {
  if (e.which === 13 && text.val().len !== 0) {
    socket.emit("message", text.val());
    text.val("");
  }
});

socket.on("createMessage", (messsage) => {
  $("ul").append(`<li class="messsage">  <b> User </b> <br> ${messsage}</li>`);
  scrollToBottom();
});

const scrollToBottom = () => {
  let d = $(".main__chat__window");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;

  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

setMuteButton = () => {
  const html = `
    <i class="fa-solid fa-microphone"></i>
    <span> Mute </span>
  `;

  document.querySelector(".main__mute_button").innerHTML = html;
};

setUnmuteButton = () => {
  const html = `
  <i class="unmute fa-solid fa-microphone-slash"></i>
    <span> Unmute </span>
  `;

  document.querySelector(".main__mute_button").innerHTML = html;
};

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;

  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

setStopVideo = () => {
  const html = `
    <i class="fa-solid fa-video"></i>
    <span> Stop Video </span>
  `;

  document.querySelector(".main__mute_video").innerHTML = html;
};

setPlayVideo = () => {
  const html = `
  <i class="unmute fa-solid fa-video-slash"></i>
    <span> Play Video </span>
  `;

  document.querySelector(".main__mute_video").innerHTML = html;
};
