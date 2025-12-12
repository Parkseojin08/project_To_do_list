// https://soonysoon.tistory.com/79 참고
// https://velog.io/@ldy290/nodejs-express-%EA%B8%B0%EB%B3%B8-%ED%8F%B4%EB%8D%94-%EA%B5%AC%EC%A1%B0 폴더 구조
// https://www.npmjs.com/package/cors
// https://node-postgres.com/ 쿼리
// https://gustjr7532.tistory.com/63#google_vignette 사용법 들
// https://ji-hoon.github.io/blog/JWT-and-authorization 토큰
// https://www.daleseo.com/js-jwt/ 토큰 2
// https://velog.io/@server30sopt/Node.js-Swagger-openapi-3.0.0-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0-3evmesru 스워거
// https://mixedcode.com/blog/detail?pid=5 스윀

//https://chuun92.tistory.com/56#google_vignette 암호
process.env.TZ = 'UTC';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db/db.js');
const jwt = require('jsonwebtoken')
const { swaggerUi, specs } = require('./swagger/generateYaml.js');
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs,{
    customSiteTitle: "TO DO LIST API Swagger"
}));

app.use(cors());
app.use(express.json());

//https://millo-l.github.io/Nodejs-express-router-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0/

const loginRouter = require('./routes/auth/login.js');
const registerRouter = require('./routes/auth/register.js');
const emailCheckRouter = require('./routes/auth/emailCheck.js');
const profileRouter = require('./routes/users/users.js')

const allTodos = require('./routes/todos/allTodos.js')

// 회원 관련
app.use('/auth/login', loginRouter);
app.use('/auth/register', registerRouter);
app.use('/auth/emailcheck', emailCheckRouter);
// 프로필
app.use('/users/profile', profileRouter)
// todo
app.use('/todos', allTodos);
app.use('/todos/:id', allTodos);

app.listen(process.env.ND_PORT, () => {
    console.log('Server running');
});