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
import { bookRouter } from './src/book/book.route.js';
import { communitiesRouter } from './src/communities/communities.route.js';

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
app.use('/books', bookRouter);
app.use('/communities', communitiesRouter);


// index.js
app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});


// error handling
app.use((err, req, res, next) => {
    console.log(err);

    // 템플릿 엔진 변수 설정
    res.locals.message = err.message;
    // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
})
