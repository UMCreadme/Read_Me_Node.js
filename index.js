import express from 'express';
import http from 'http';
import { response } from './config/response.js';
import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';
import dotenv from 'dotenv';
import cors from 'cors';

import { testRouter } from './src/test/test.route.js';
import { userRouter } from './src/users/users.route.js';
import { shortsRouter } from './src/shorts/shorts.route.js';
import { homeRouter } from './src/home/home.route.js';
import { bookRouter } from './src/book/book.route.js';
import { communitiesRouter } from './src/communities/communities.route.js';
import { researchRouter } from './src/research/research.route.js';
import { healthRouter } from './src/health/health.route.js';
import { chatRouter } from './src/chat/chat.route.js';

import initializeSocket from './config/socketServer.js';  // 'initializeSocket' 함수를 default로 임포트

dotenv.config();

const app = express();
const server = http.createServer(app);  // HTTP 서버 생성

// 서버 설정
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 라우터 설정
app.use('/test', testRouter);
app.use('/users', userRouter);
app.use('/shorts', shortsRouter);
app.use('/home', homeRouter);
app.use('/books', bookRouter);
app.use('/communities', communitiesRouter);
app.use('/communities', chatRouter);
app.use('/recent-searches', researchRouter);
app.use('/health', healthRouter);

// 소켓 초기화
const io = initializeSocket(server);  // 소켓 서버 초기화

app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});

// 에러 처리
app.use((err, req, res, next) => {
    console.log(err);

    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

    if (err instanceof BaseError) {
        return res.status(err.data.status).send(response(err.data));
    } else {
        return res.send(response(status.INTERNAL_SERVER_ERROR));
    }
});

// 서버 시작
server.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
});
