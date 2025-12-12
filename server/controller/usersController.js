require('dotenv').config()
const pool = require('../db/db.js');
const jwt = require('jsonwebtoken');

exports.profile = async (req, res) => {
   try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '토큰 없음' });
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

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
}