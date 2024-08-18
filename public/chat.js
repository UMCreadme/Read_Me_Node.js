document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000');

    const joinRoomButton = document.getElementById('joinRoomButton');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const statusDiv = document.getElementById('status');

    let roomJoined = false;
    let currentUserId = '';
    let currentPage = 1;
    const pageSize = 20;
    let loadingMessages = false;
    let noMoreMessages = false;
    let isAtBottom = true;

    joinRoomButton.addEventListener('click', () => {
        const communityId = document.getElementById('communityId').value;
        const userId = document.getElementById('userId').value;

        if (communityId && userId) {
            currentUserId = userId;
            if (!roomJoined) {
                socket.emit('joinRoom', { communityId, userId });
                roomJoined = true;
                loadMessages();
            } else {
                alert('이미 방에 참여했습니다.');
            }
        } else {
            alert('커뮤니티 ID와 사용자 ID를 입력해주세요.');
        }
    });

    function sendMessage() {
        const message = messageInput.value;
        const communityId = document.getElementById('communityId').value;

        if (message && communityId) {
            socket.emit('sendMessage', { message, communityId });
            messageInput.value = '';
        } else {
            alert('메시지와 방 정보를 입력해주세요.');
        }
    }

    sendMessageButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    function loadMessages(page = currentPage) {
        const communityId = document.getElementById('communityId').value;
        if (!loadingMessages && !noMoreMessages) {
            loadingMessages = true;
            socket.emit('loadMessages', { communityId, page, size: pageSize });
        }
    }

    socket.on('loadMessages', ({ messages, pageInfo }) => {
        if (messages) {
            if (messages.length < pageSize) {
                noMoreMessages = true;
            }

            messages.forEach((message) => {
                const existingMessage = document.getElementById(`message-${message.messageId}`);
                if (!existingMessage) {
                    const messageElement = document.createElement('div');
                    messageElement.id = `message-${message.messageId}`;
                    messageElement.classList.add('message');
                    if (message.userId === currentUserId) {
                        messageElement.classList.add('mine');
                    } else {
                        messageElement.classList.add('theirs');
                    }
                    messageElement.textContent = `${message.userId}: ${message.content}`;
                    messagesContainer.prepend(messageElement);
                }
            });

            if (messages.length > 0) {
                const latestMessageId = messages[0].messageId;
                if (latestMessageId) {
                    socket.emit('messageRead', { messageId: latestMessageId });
                }
            }

            loadingMessages = false;
        } else {
            loadingMessages = false;
        }
    });

    socket.on('message', (data) => {
        if (data && data.userId && data.content && data.messageId) {
            const { userId, content, messageId } = data;
            const existingMessage = document.getElementById(`message-${messageId}`);
            if (!existingMessage) {
                const messageElement = document.createElement('div');
                messageElement.id = `message-${messageId}`;
                messageElement.classList.add('message');
                if (userId === currentUserId) {
                    messageElement.classList.add('mine');
                } else {
                    messageElement.classList.add('theirs');
                }
                messageElement.textContent = `${userId}: ${content}`;
                messagesContainer.appendChild(messageElement);

                if (isAtBottom) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }

                socket.emit('messageRead', { messageId });
            }
        }
    });

    socket.on('messageRead', (messageId) => {
        // 메시지 읽음 처리에 대한 추가 로직이 필요하다면 여기에 작성
    });

    socket.on('joinRoomSuccess', (data) => {
        if (data && data.message) {
            statusDiv.textContent = data.message;
            currentUserId = data.userId || currentUserId;
            loadMessages();
        }
    });

    socket.on('joinRoomError', (error) => {
        alert(`방에 참여하는 중 오류 발생: ${error}`);
        location.reload();
    });

    socket.on('disconnect', () => {
        // 서버와의 연결이 끊어졌을 때 처리할 로직
    });

    messagesContainer.addEventListener('scroll', () => {
        if (messagesContainer.scrollTop === 0 && !loadingMessages && !noMoreMessages) {
            currentPage++;
            loadMessages(currentPage);
        }

        isAtBottom = (messagesContainer.scrollHeight - messagesContainer.scrollTop === messagesContainer.clientHeight);
    });

    window.addEventListener('load', () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    socket.on('message', () => {
        if (isAtBottom) {
            scrollToBottom();
        }
    });

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
