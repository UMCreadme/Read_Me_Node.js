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

    joinRoomButton.addEventListener('click', () => {
        const communityId = document.getElementById('communityId').value;
        const userId = document.getElementById('userId').value;

        if (communityId && userId) {
            currentUserId = userId;
            if (!roomJoined) {
                socket.emit('joinRoom', { communityId, userId, page: currentPage, size: pageSize });
                roomJoined = true;
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
            messageInput.value = ''; // 메시지 전송 후 입력 필드 비우기
        } else {
            alert('메시지와 방 정보를 입력해주세요.');
        }
    }

    sendMessageButton.addEventListener('click', sendMessage);

    // 엔터 키로 메시지 전송
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // 기본 엔터 동작(줄바꿈) 방지
            sendMessage();
        }
    });

    // 메시지 로드 요청
    function loadMessages() {
        const communityId = document.getElementById('communityId').value;
        if (!loadingMessages && !noMoreMessages) {
            loadingMessages = true;
            socket.emit('loadMessages', { communityId, page: currentPage, size: pageSize });
        }
    }

    socket.on('loadMessages', ({ messages, pageInfo }) => {
        if (messages) {
            if (messages.length < pageSize) {
                noMoreMessages = true;
            }

            // 메시지를 역순으로 추가
            messages.reverse().forEach((message) => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                if (message.userId === currentUserId) {
                    messageElement.classList.add('mine');
                } else {
                    messageElement.classList.add('theirs');
                }
                messageElement.textContent = `${message.userId}: ${message.content}`;
                messagesContainer.prepend(messageElement); // 역순으로 추가
            });

            if (currentPage === 1) {
                // 초기 로드 시 스크롤을 맨 아래로
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                // 이전 메시지 로드 후 스크롤 위치 유지
                const currentScrollHeight = messagesContainer.scrollHeight;
                const scrollOffset = currentScrollHeight - messagesContainer.scrollHeight;
                messagesContainer.scrollTop += scrollOffset;
            }
            loadingMessages = false;
        } else {
            console.error('메시지 로드 중 문제가 발생했습니다.');
            loadingMessages = false;
        }
    });

    // 메시지 수신 시 읽음 상태 업데이트 요청
    socket.on('message', (data) => {
        if (data && data.userId && data.content && data.messageId) {
            const { userId, content, messageId } = data;
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (userId === currentUserId) {
                messageElement.classList.add('mine');
            } else {
                messageElement.classList.add('theirs');
            }
            messageElement.textContent = `${userId}: ${content}`;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // 최신 메시지가 보이도록 스크롤 조정

            // 메시지를 수신하면 읽음 상태 업데이트 요청
            if (roomJoined) {
                socket.emit('messageRead', { messageId });
            }
        } else {
            console.error('받은 메시지가 유효하지 않거나 messageId가 없습니다.');
        }
    });

    socket.on('messageRead', (messageId) => {
        if (messageId) {
            console.log(`메시지 ${messageId} 읽음 처리됨`);
        } else {
            console.error('읽음 처리된 메시지 ID가 유효하지 않습니다.');
        }
    });

    socket.on('joinRoomSuccess', (data) => {
        if (data && data.message) {
            statusDiv.textContent = data.message;
            currentUserId = data.userId || currentUserId;
            loadMessages(); // 방 참여 성공 후 메시지 로드
            socket.emit('updateReadStatus', { communityId: document.getElementById('communityId').value, userId: currentUserId });
        } else {
            console.error('방 참여 성공 메시지가 유효하지 않습니다.');
        }
    });

    socket.on('joinRoomError', (error) => {
        alert(`방에 참여하는 중 오류 발생: ${error}`);
        location.reload();
    });

    socket.on('disconnect', () => {
        console.log('서버와의 연결이 끊어졌습니다.');
    });

    // 스크롤 이벤트 핸들러
    messagesContainer.addEventListener('scroll', () => {
        if (messagesContainer.scrollTop === 0 && !loadingMessages && !noMoreMessages) {
            currentPage++;
            loadMessages();
        }
    });
});
