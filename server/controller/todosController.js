require('dotenv').config();
const pool = require('../db/db.js');
const jwt = require('jsonwebtoken');



// Todo list 조회
exports.getTodos = async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({success: false, })
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const response = await pool.query(
            'select todo_id, title, description, date, completed from todolist.todos where  user_id = $1',
            [decoded.user_id]
        )

        res.status(200).json({
            success: true,
            datas: {...response.rows}
        });

    }catch(err){
        res.status(401).json({success: false, })
    }
}

// TO DO 생성
exports.postTodos = async (req, res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ success: false });
            return;
        }
        const {title, description , date} = req.body;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

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
            success: false,
        })
    }
}

// to do 삭제
exports.deleteTodos = async (req,res) => {
        try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ success: false });
            return;
        }
        const { id } = req.params;
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const response = await pool.query(
            'delete from todolist.todos where todo_id = $1 AND user_id = $2',
            [id,decoded.user_id]
        )
        res.status(200).json({
            success: true,
        })

        }catch(err){
            res.status(401).json({
                success: false,
            })
        }
};

// todo 수정
exports.putTodos = async (req,res) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ success: false });
            return;
        }
        const { id } = req.params;
        const { title, description, date, completed } = req.body;

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const response = await pool.query(
            'update todolist.todos set title = $1, description = $2, date = $3, completed = $4 where todo_id = $5 and user_id = $6',
            [title, description, date, completed, id, decoded.user_id]
        )
        res.status(200).json({
            success: true,
        })

    }catch(err){
        res.status(401).json({
            success: false
        })
    }
};