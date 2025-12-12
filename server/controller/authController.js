require('dotenv').config();
const pool = require('../db/db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



exports.login =  async (req, res) => {
    try{
        const { email, password } = req.body;

        const data = await pool.query(
            'select * from todolist.users where email = $1', [email]
        )
        const findUser = data.rows[0]; // 객체 형태 { }
        if (!findUser) {
            return res.status(401).json({ 
                success: false
            });
        }
        
        const checkpassword = await bcrypt.compare(password, findUser.password);

        if(!checkpassword){
            return res.status(401).json({success: false});   
        }

        // 토큰 생성
        const payload = {
                user_id: findUser.user_id,
                username: findUser.username,
                email: findUser.email,
                created_at: findUser.created_at
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'}); // 토큰생성
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(200).json({
            success: true,
            token: token,
            user:{...payload},
        })
        
    }catch(err){
        console.error(err);
        res.status(500).json({
            success: false
        })
    }
};


exports.register = async (req, res) => {
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
            user: request.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false
        });
    }
};



exports.emailcheck =  async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            res.status(400).json({ 
                success: false, 
            });
            return; 
        }

        const response = await pool.query(
            'SELECT email FROM todolist.users WHERE email = $1',
            [email]
        );

        if (response.rows.length > 0) {
             res.status(409).json({ 
                success: false
            });
            return;
        } else {
            res.status(200).json({ 
                success: true
            });
            return;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false
        });
    }
};



