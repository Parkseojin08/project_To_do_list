import { useEffect,useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import ProfileS from './Profile.module.css';
import axios from 'axios';

export default function Profile(){
    const [user, setUser] = useState(null);

    const [datas, setDatas] = useState([0,0]);

    const move = useNavigate()
    const check = async () => {
        try{
            const response = await axios.get('/users/profile',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if(response.data.success){
                setUser(response.data.user);
                console.log(response.data.user)
            }else{
                alert("유효하지 않습니다.");
            }
        }catch(err){
            console.error(err);
            alert("유저의 정보가 없습니다.")
            move("/signin")
        }
    }

    const getData = async () => {
        try{
            await axios.get("/todos",{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((res) => {
                const data = Object.values(res.data.datas).reduce((acc, info) => {
                    if(info.completed){
                        acc[0] += 1;
                    }else{
                        acc[1] += 1;
                    }
                    return acc;
                }, [0,0]);
                setDatas(data);
            })
            .catch(err => console.error(err.response));

        }catch(err){
            console.error(err);
        }
    }
    
    useEffect(() => {
        check()
        getData()
    },[])
    
    return(
        <div className={ProfileS.box}>
            <div className={ProfileS.profile}>
                <div className={ProfileS.title}>
                    <h1>
                        Profile
                    </h1>
                </div>
                <div className={ProfileS.info}>
                    <div className={ProfileS.name}>
                        <h1>
                            name: {user?.username}
                        </h1>
                    </div>
                    <div className={ProfileS.email}>
                        <h2>
                            Email: {user?.email}
                        </h2>
                    </div>
                    <div className={ProfileS.create}>
                        <h2>
                            create_At: {user?.created_at}
                        </h2>
                    </div>
                    <div className={ProfileS.check}>
                        <div>
                            <h2>완료한 일</h2>
                            <p>completed: {datas[0]}</p>
                        </div>
                        <div>
                            <h2>남은 일</h2>
                            <p>remaining: {datas[1]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}