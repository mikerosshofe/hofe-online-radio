const socket = io();

// Chat functionality
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (msg) => {
  const messages = document.getElementById('messages');
  const message = document.createElement('li');
  message.textContent = msg;
  messages.appendChild(message);
});

function sendMessage() {
  const input = document.getElementById('input');
  socket.emit('message', input.value);
  input.value = '';
}

// Peer-to-peer video communication
document.getElementById('startVideo').addEventListener('click', () => {
  const videoContainer = document.getElementById('videos');
  const myVideo = document.createElement('video');
  myVideo.muted = true;
  videoContainer.appendChild(myVideo);

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideo.srcObject = stream;
    myVideo.play();

    const peer = new SimplePeer({
      initiator: location.hash === '#init',
      trickle: false,
      stream: stream
    });

    peer.on('signal', data => {
      socket.emit('signal', {
        signal: data,
        callerId: socket.id,
        target: 'all' // For simplicity, sending signal to all connected users
      });
    });

    socket.on('signal', data => {
      peer.signal(data.signal);
    });

    peer.on('stream', stream => {
      const userVideo = document.createElement('video');
      userVideo.srcObject = stream;
      userVideo.play();
      videoContainer.appendChild(userVideo);
    });
  }).catch(error => {
    console.error('Error accessing media devices.', error);
  });
});
