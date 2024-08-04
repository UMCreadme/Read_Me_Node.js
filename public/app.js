document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const messagesList = document.getElementById('messages');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');

    const communityId = 'defaultRoom'; // 사용하려는 커뮤니티(채팅방) ID

    // 방에 참여
    socket.emit('joinRoom', communityId);

    // 메시지 수신 처리
    socket.on('message', (message) => {
        const item = document.createElement('li');
        item.textContent = `${message.userId}: ${message.content}`;
        messagesList.appendChild(item);
    });

    // 메시지 전송 처리
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = {
            room: communityId,
            userId: 'User1', // 동적으로 사용자 ID를 설정할 수 있음
            content: messageInput.value,
            createdAt: new Date()
        };
        socket.emit('message', message);
        messageInput.value = '';
    });
});
