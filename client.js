var socket = io('http://localhost:5000');
socket.on('RoundId', data => {
  console.log(data);
})

socket.on('Round_Status', data => {
    console.log(data);
  })


  socket.on('Counter', data => {
    console.log(data);
  })
  
  socket.on('Result', data => {
    console.log(data);
  })

  socket.on('Previous_Results', data => {
    console.log(data);
  })


 