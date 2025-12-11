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
const bcrypt = require('bcrypt');
const pool = require('./db/db.js');
const jwt = require('jsonwebtoken')
const { swaggerUi, specs } = require('./swagger.js');
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs,{
    customSiteTitle: "TO DO LIST API Swagger"
}));

app.use(cors());
app.use(express.json());

app.get("/api/message",(req, res) => {
    res.send("연결됨");
})

//회원가입
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "test1"
 *               email:
 *                 type: string
 *                 example: "test1@test.test"
 *               password:
 *                 type: string
 *                 example: "test12008!"
 *     responses:
 *       200:
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: Boolean
 *                   example: true
 *                 message: 
 *                   type: string
 *                   example: "회원가입 성공"
 *                 user: 
 *                   type: object
 *                   properties:
 *                     user_id: 
 *                       type: int
 *                       example: 2
 *                     username:
 *                       type: string
 *                       example: "test1"
 *                     password:
 *                       type: string
 *                       example: "$10$vUB1q.9UghVtKXJVEhvXB.CQrwJNklnV92x5uQ0ddHRfZIWPus7Li"
 *                     email:
 *                       type: string
 *                       example: "test1@test.test"
 *                     created_at: 
 *                       type: string
 *                       example: "2025-12-09 10:18:00.300"
 */
app.post('/auth/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const encryption = 10;
        const hash = await bcrypt.hash(password, encryption);
        const request = await pool.query(
            'INSERT INTO todolist.users(username, password, email) VALUES($1, $2, $3) RETURNING *',
            [username, hash, email]
        );
        res.status(200).json({
            success: true,
            message: '회원가입 성공',
            user: request.rows[0]
        });
    } catch (err) {
        console.error('회원가입:', err);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

// 이메일 중복 검사
/**
 * @swagger
 * /login/emailcheck:
 *   get:
 *     summary: 이메일 중복 검사
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: 이메일 검사
 *         schema:
 *           type: string
 *           example: "test@test.test"
 *     responses:
 *       200:
 *         description: "사용 가능한 이메일"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "사용 가능한 이메일입니다." 
 *       400:
 *         description: "이메일을 입력하지 않음"
 *         content: 
 *           application/json:
 *             schema:
 *               type: object             
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message: 
 *                   type: string
 *                   example: "이메일을 입력해주세요."
 *       409:
 *         description: "이메일이 이미 사용 중"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message: 
 *                   type: string
 *                   example: "이미 사용 중인 이메일입니다."
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message: 
 *                   type: string
 *                   example: "서버에 오류가 발생했습니다."
 */
app.get('/login/emailcheck', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: '이메일을 입력해주세요' 
            });
        }

        const response = await pool.query(
            'SELECT email FROM todolist.users WHERE email = $1',
            [email]
        );

        if (response.rows.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: '이미 사용중인 이메일입니다.',
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                message: '사용 가능한 이메일입니다.',
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});


// 로그인
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@test.test"
 *               password:
 *                 type: string
 *                 example: "test2008!"
 *     responses:
 *       200:
 *         content: 
 *           application/json:
 *             schema:  
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true 
 *                 message: 
 *                   type: string
 *                   example: "로그인 성공"
 *                 token: 
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImV4YW1wbGV1c2VyIiwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiY3JlYXRlZF9hdCI6IjIwMjEtMDEtMDEiLCJpYXQiOjE2ODkzNDU2MDAsImV4cCI6MTY4OTM0OTIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 user: 
 *                   type: object
 *                   properties: 
 *                     user_id: 
 *                       type: int
 *                       example: 1
 *                     username: 
 *                       type: string
 *                       example: "test"
 *                     email: 
 *                       type: string
 *                       example: "test@test.test"
 *                     created_at:
 *                       type: string
 *                       example: "2025-12-10"
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: "Boolean"
 *                  example: false
 *                message: 
 *                 type: "string"
 *                 example: "서버 오류"
 */
app.post('/auth/login', async (req, res) => {
    try{
        const { email, password } = req.body;

        const data = await pool.query(
            'select * from todolist.users where email = $1', [email]
        )
        const findUser = data.rows[0]; // 객체 형태 { }
        if (!findUser) {
            return res.status(401).json({ 
                success: false,
                message: '사용자를 찾을 수 없습니다.' 
            });
        }
        
        const checkpassword = await bcrypt.compare(password, findUser.password);

        if(!checkpassword){
            return res.status(401).json({success: false,
                message: '비밀번호가 다릅니다.'});   
        }

        // 토큰 생성
        const payload = {
                user_id: findUser.user_id,
                username: findUser.username,
                email: findUser.email,
                created_at: findUser.created_at
        }
        const secretkey = 'jwt-secret-key'; // 서명
        const token = jwt.sign(payload,secretkey, {expiresIn: '1h'}); // 토큰생성
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(200).json({
            success: true,
            message: "로그인 성공",
            token: token,
            user:{...payload},
        })
        
    }catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: '서버 오류'
        })
    }
});

// 프로필
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 사용자의 프로필을 조회
 *     description: JWT 토큰을 통해 로그인한 사용자의 프로필 정보를 반환합니다.
 *     responses:
 *       200:
 *         description: 성공적으로 프로필 정보를 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: int
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "test1"
 *                     email:
 *                       type: string
 *                       example: "test1@test.test"
 *                     created_at:
 *                       type: string
 *                       example: "2025-12-09 10:18:00.300"
 *       401:
 *         description: 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰 없음"
 */
app.get('/users/me', async (req, res) => {
   try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '토큰 없음' });
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');

        const date = decoded.created_at.split("T")
        console.log(token)
        res.status(200).json({
            success: true,
            user: {
                user_id: decoded.user_id,
                username: decoded.username,
                email: decoded.email,
                created_at: date[0]
            }  // 프로필 데이터
        });

    } catch (err) {
        res.status(401).json({ message: '토큰 없음' });
    }
})


// TO DO 생성
/**
 * @swagger
 * /todos:
 *   post:
 *     summary: "TO DO 생성"
 *     description: "토큰과 user의 고유 id가 필요합니다."
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *                 example: "회의"
 *               description: 
 *                 type: string
 *                 example: "일일 보고에 관하여"
 *               deadline: 
 *                 type: string
 *                 example: "2025-11-25"
 *     responses: 
 *       200:
 *         description: "TO DO 추가 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 datas:
 *                   type: object
 *                   properties:
 *                     todo_id:
 *                       type: int
 *                       example: 1
 *                     title: 
 *                       type: string
 *                       example: "회의"
 *                     description:
 *                       type: string
 *                       example: "일일 보고에 관하여"
 *                     date:
 *                       type: string
 *                       example: "2025-11-25"
 *                     created_at:
 *                       type: string
 *                       example: "2025-12-10T12:05:00"
 *                     user_id:
 *                       type: int
 *                       example: 1
 *       401:
 *         descript: "토큰이 없을떄."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "토큰없음"
 *           
 */
app.post('/todos', async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '토큰 없음' });
            return;
        }
        const {title, description , date} = req.body;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');

        const response = await pool.query(
            'insert into todolist.todos(title, description, date, completed, user_id) values ($1, $2, $3, $4, $5) RETURNING *',
            [title, description , date, false, decoded.user_id]
        )
        res.status(200).json({
            success: true,
            datas: response.rows[0]
        })

    }catch(err){
        res.status(401).json({
            message: "토큰 없음"
        })
    }
})

// to do 삭제
/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: "TO DO 삭제"
 *     description: "토큰의 유저 고유 id와 To Do 에 저장된 유저 고유 ID가 같으면 삭제"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "삭제할 TO DO의 ID"
 *         schema:
 *           type: int
 *           example: 1
 *     responses:
 *       200:
 *         description: "삭제성공 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 successs: 
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "삭제성공!"
 *       401:
 *         desription: "삭제실패 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 success: 
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "삭제 실패!"
 */
app.delete('/todos/:id', async (req,res) => {
        try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '삭제 실패' });
            return;
        }
        const { id } = req.params;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');
        
        const response = await pool.query(
            'delete from todolist.todos where todo_id = $1 AND user_id = $2',
            [id,decoded.user_id]
        )
        res.status(200).json({
            success: true,
            message: "삭제성공!"
        })

        }catch(err){
            res.status(401).json({
                success: false,
                message: "삭제 실패"
            })
        }
});

// todo 수정
/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: "To Do 수정"
 *     description: "토큰의 userid와 todo_id가 맞는지 확인 후 정보 수정"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "수정할 To DO 의 ID"
 *         schema:
 *           type: int
 *           example: 1
 *     requestBody:
 *       description: "수정할 데이터"
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "회의 안건"
 *               description:
 *                 type: string
 *                 example: "회의 안건을 만들어 봅시다."
 *               date:
 *                 type: string
 *                 example: "2025-12-10"
 *     responses:
 *       200:
 *         description: "수정 성공 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "수정 성공" 
 *       401:
 *         description: "수정 실패 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "수정 실패"         
 */
app.put('/todos/:id', async (req,res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '수정 실패' });
            return;
        }
        const { id } = req.params;
        const { title, description, date, completed } = req.body;

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');
        
        const response = await pool.query(
            'update todolist.todos set title = $1, description = $2, date = $3, completed = $4 where todo_id = $5 and user_id = $6',
            [title, description, date, completed, id, decoded.user_id]
        )
        res.status(200).json({
            success: true,
            message: "수정 성공!"
        })

    }catch(err){
        res.status(401).json({
            message: "수정 실패."
        })
    }
});


// 검색기능

// Todo list 조회
/**
 * @swagger
 * /todos:
 *   get:
 *     summary: "TO DO List 조회"
 *     description: "토큰의 user id를 받아 TO DO 스키마에 저장된 user id에 관한 모든 데이터를 불러옴"
 *     responses:
 *       200:
 *         description: "성공 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 datas:
 *                   type: object
 *                   properties:
 *                     todo_id:
 *                       type: int
 *                       example: "1"
 *                     title: 
 *                       type: string
 *                       example: "회의 안건"
 *                     description:
 *                       type: string
 *                       example: "회의 안건을 만들어 봅시다."
 *                     date:
 *                       type: string
 *                       example: "2025-12-10"
 *                     completed: 
 *                       type: boolean
 *                       example: false
 *       401:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   message: "토큰 없음"
 */
app.get('/todos', async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({success: false, message: '토큰 없음'})
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');

        const response = await pool.query(
            'select todo_id, title, description, date, completed from todolist.todos where  user_id = $1',
            [decoded.user_id]
        )

        res.status(200).json({
            success: true,
            datas: {...response.rows}
        });

    }catch(err){
        res.status(401).json({success: false, message: '토큰 없음'})
    }
})

// 체크 완료만
/**
 * @swagger
 * /todos/checkOk:
 *   get:
 *     summary: "TO DO List completed 조회"
 *     description: "토큰의 user id를 받아 TO DO 스키마에 저장된 user id에 관한 모든 데이터를 불러옴 단. completed 항목이 true일 겅우만"
 *     responses:
 *       200:
 *         description: "성공 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 datas:
 *                   type: object
 *                   properties:
 *                     todo_id:
 *                       type: int
 *                       example: "1"
 *                     title: 
 *                       type: string
 *                       example: "회의 안건"
 *                     description:
 *                       type: string
 *                       example: "회의 안건을 만들어 봅시다."
 *                     date:
 *                       type: string
 *                       example: "2025-12-10"
 *                     completed: 
 *                       type: boolean
 *                       example: true
 *       401:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   message: "토큰 없음"
 */
app.get('/todos/checkOk', async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '토큰 없음' });
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');

        const response = await pool.query(
            'select todo_id, title, description, date, completed, created_at from todolist.todos where user_id = $1 and completed = true',
            [decoded.user_id]
        )

        res.status(200).json({
            success: true,
            datas: {...response.rows}
        });

    }catch(err){
        res.status(401).json({message: '토큰 없음'})
    }
})

// 체크 안된것만
/**
 * @swagger
 * /todos/checkNo:
 *   get:
 *     summary: "TO DO List Not completed 조회"
 *     description: "토큰의 user id를 받아 TO DO 스키마에 저장된 user id에 관한 모든 데이터를 불러옴, 단 completed가 false인 것만"
 *     responses:
 *       200:
 *         description: "성공 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 datas:
 *                   type: object
 *                   properties:
 *                     todo_id:
 *                       type: int
 *                       example: "1"
 *                     title: 
 *                       type: string
 *                       example: "회의 안건"
 *                     description:
 *                       type: string
 *                       example: "회의 안건을 만들어 봅시다."
 *                     date:
 *                       type: string
 *                       example: "2025-12-10"
 *                     completed: 
 *                       type: boolean
 *                       example: false
 *       401:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   message: "토큰 없음"
 */
app.get('/todos/checkNo', async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '토큰 없음' });
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');

        const response = await pool.query(
            'select todo_id, title, description, date, completed, created_at from todolist.todos where user_id = $1 and completed = false',
            [decoded.user_id]
        )

        res.status(200).json({
            success: true,
            datas: {...response.rows}
        });

    }catch(err){
        res.status(401).json({message: '토큰 없음'})
    }
})

// 타이틀로 받기
/**
 * @swagger
 * /todos/{title}:
 *   get:
 *     summary: "TO DO List title 조회"
 *     description: "토큰의 user id를 받아 TO DO 스키마에 저장된 user id에 관한 모든 데이터를 불러옴, 단 title과 비슷한 으름의 데이터만"
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: "비슷한 이름의 TO Do 조회"
 *         schema:
 *           type: int
 *           example: "회의"
 *     responses:
 *       200:
 *         description: "성공 시"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: true
 *                 datas:
 *                   type: object
 *                   properties:
 *                     todo_id:
 *                       type: int
 *                       example: "1"
 *                     title: 
 *                       type: string
 *                       example: "회의 안건"
 *                     description:
 *                       type: string
 *                       example: "회의 안건을 만들어 봅시다."
 *                     date:
 *                       type: string
 *                       example: "2025-12-10"
 *                     completed: 
 *                       type: boolean
 *                       example: false
 *       401:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   message: "토큰 없음"
 */
app.get('/todos/:title', async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '토큰 없음' });
            return;
        }
        const { title } = req.params;   
        const titlePg = '%' + title + '%'
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'jwt-secret-key');

        const response = await pool.query(
            'select todo_id, title, description, date, completed, created_at from todolist.todos where user_id = $1 and title LIKE $2',
            [decoded.user_id, titlePg]
        )

        res.status(200).json({
            success: true,
            datas: {...response.rows}
        });

    }catch(err){
        res.status(401).json({message: '토큰 없음'})
    }
})

app.listen(process.env.ND_PORT, () => {
    console.log('Server running');
});