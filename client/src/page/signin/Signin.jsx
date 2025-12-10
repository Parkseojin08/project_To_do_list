import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Sign from '../Sign.module.css'

export default function Signin({setUser, setLogin}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const move = useNavigate();

    const LOGIN = async () => {
        try{
            const response = await axios.post('/auth/login',{
                email,
                password
            })

            if(response.status === 200){
                const {token,user} = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user))
                setUser(user);
                setLogin(true)
                alert(("로그인 성공!"))
                move("/")
            }
        }catch(err){
            console.error(err)
            alert("로그인 실패")
        }
    }

    return(
        <div className={Sign.body}>
            <form className={Sign.box}>
                <div className={Sign.title}>
                    <h1>LOGIN</h1>
                </div>
                <div className={Sign.input_box}>
                    <div className={Sign.input_name}>
                        <label htmlFor="email">이메일: </label>
                        <input type="email" id="email" onChange={(value) => setEmail(value.target.value)} value={email} placeholder='이름을 입력해주세요.'/>
                    </div>
                    <div className={Sign.input_password}>
                        <label htmlFor="password">비밀번호: </label>
                        <input type="password" id="password" onChange={(value) => setPassword(value.target.value)} value={password} placeholder='비밀번호를 입력해주세요.'/>
                    </div>
                </div>
                <div className={Sign.btn}>
                    <button type='button' onClick={LOGIN}>LOGIN</button>
                </div>
            </form>
        </div>
    )
}