const socket = io();

let userName;

Swal.fire({
  title: "Ingrese su nombre",
  input: "text",
  inputValidator: (value) => {
    if (!value) {
      return "Por favor, ingrese un nombre";
    }
  },
}).then( data => {
    console.log(data)
    userName = data.value;
    socket.emit('newUser', userName);
});

const inputChat = document.getElementById('inputChat');
const messagesLogs = document.getElementById('messagesLogs');

inputChat.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if(inputChat.value.trim().length > 0) {
            socket.emit('message', {user: userName, data: inputChat.value});
            inputChat.value = '';
        }
    }
});

socket.on('messagesLogs', (data) => {
    let messages = '';
    data.forEach(message => {
        messages += `<p><strong>${message.user}</strong> dice: ${message.data}</p>`;
    });
    messagesLogs.innerHTML = messages;
});

socket.on('newUserNotification', userName => {
    Swal.fire({
        title: `${userName} se conectó`,
        toast: true,
        position: 'top-right'
    })
});
