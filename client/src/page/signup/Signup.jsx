import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import axios from 'axios';
import Sign from '../Sign.module.css'

export default function Signup(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const move = useNavigate();

    const [checkEmail, setCheckEmail] = useState(false);
    
    const join = async () => {
        if(!username || !password || !email){
            alert("이름과 패스워드 그리고 이메일을 모두 작성해주세요")
            return;
        }
        if(!checkEmail){
            alert("이메일 중복을 확인해주세요!");
            return;
        }
        const regexName = /^[A-Za-z가-힣]{2,16}$/.test(username);
        if(!regexName){
            alert("아름의 형식을 맞추어주세요");
            return;
        }
        const regexPassword = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^*+=-])[a-zA-Z0-9!@#$%^*+=-]{8,16}$/.test(password);
        if (!regexPassword) {
            alert("패스워드의 조건을 충족하지 못하였습니다.");
            return;
        }
        const regexEmail = /^[A-Za-z.]{2,36}@[A-Za-z.]{2,20}\.[A-Za-z]{2,10}$/.test(email)
        if(!regexEmail){
            alert("이메일 형식을 맞춰주세요.")
            return;
        }
        try{
            const response = await axios.post("/auth/register",{
                username,
                password,
                email
            })
            if(response.status === 200){
                alert(`회원가입 성공!`);
                move("/signin")
            }
        }catch (err){
            console.error(err)
        }
    }

    const checkEmails = async () => {
        if (!email) {
            alert("이메일을 입력해주세요");
            return;
        }

        const regexEmail = /^[A-Za-z.]+@[A-Za-z.]{2,}\.[A-Za-z]{2,}$/.test(email)
        
        if(!regexEmail){
            alert("이메일 형식을 맞춰주세요.")
            return;
        }
        
        try {
            const response = await axios.get("/auth/emailcheck", {
                params: { email }
            });
            
            console.log(response);
            
            alert("사용 가능한 이메일입니다.");
            setCheckEmail(true);
            
        } catch (err) {
            if (err.response?.status === 409) {
                alert("이미 사용중인 이메일입니다.");
                setCheckEmail(false);
            } else {
                console.error(err);
                alert("이메일 확인 중 오류가 발생했습니다.");
            }
        }
    };

    return(
        <div className={Sign.body}>
            <form className={Sign.box}>
                <div className={Sign.title}>
                    <h1>JOIN</h1>
                </div>
                <div className={Sign.input_box}>
                    <div className={Sign.input_name}>
                        <label htmlFor="username">이름: </label>
                        <input type="text" id="username" onChange={(value) => setUsername(value.target.value)} value={username} placeholder="영문/한글 2 ~ 16자"/>
                    </div>
                    <div className={Sign.input_password}>
                        <label htmlFor="password">비밀번호: </label>
                        <input type="password" id="password" onChange={(value) => setPassword(value.target.value)} value={password} placeholder='영문/숫자/특수기호'/>
                    </div>
                    <p style={{fontSize: "0.8rem", margin: 0}}><i><b>각 1개씩 포함 8~16, 특수기호 <span style={{color: "white", border: "1px solid black", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "1px"}}> !@#$%^*+=-:</span></b></i></p>
                    <div className={Sign.input_email}>
                        <label htmlFor="email">이메일: </label>
                        <div>
                            <input type="email" id="email" onChange={(value) => setEmail(value.target.value)} value={email} placeholder='exam@yoho.com'/>
                            <button type='button' onClick={() => checkEmails()}>중복 확인</button>
                        </div>
                    </div>
                </div>
                <div className={Sign.btn}>
                    <button type='button' onClick={join}>JOIN</button>
                </div>
            </form>
        </div>
    )
}
