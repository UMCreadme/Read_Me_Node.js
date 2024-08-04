import express from 'express';    
import { response } from './config/response.js';
import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';
import dotenv from 'dotenv';
import cors from 'cors';

import { testRouter } from './src/test/test.route.js';
import { userRouter } from './src/users/users.route.js';
import { shortsRouter } from './src/shorts/shorts.route.js';
import { homeRouter } from './src/home/home.route.js';
import { communitiesRouter } from './src/communities/communities.route.js';
import { researchRouter } from './src/research/research.route.js';
import { healthRouter } from './src/health/health.route.js';


dotenv.config();

const app = express();

// server setting - view, static, body-parser etc..
app.set('port', process.env.PORT || 3000);  // 서버 포트 지정
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({extended: false})); // 단순 객체 문자열 형태로 본문 데이터 해석

// router setting
app.use('/test', testRouter);
app.use('/users', userRouter);
app.use('/shorts', shortsRouter);
app.use('/home', homeRouter);
app.use('/communities', communitiesRouter);
app.use('/recent-searches', researchRouter);
app.use('/health', healthRouter);

// index.js
app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});


// error handling
app.use((err, req, res, next) => {
    console.error('Error:', err); // 에러를 콘솔에 기록합니다.

    if (err instanceof BaseError) {
        // BaseError의 경우, status 코드와 메시지를 사용하여 응답합니다.
        res.status(err.data.status).json({
            isSuccess: err.data.isSuccess,
            code: err.data.code,
            message: err.data.message
        });
    } else {
        // 일반 에러의 경우, 500 상태 코드와 기본 메시지를 사용하여 응답합니다.
        res.status(500).json({
            isSuccess: false,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Server Error'
        });
    }
});

app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
})
