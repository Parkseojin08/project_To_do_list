//https://kyung-a.tistory.com/33 토큰

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import Style from './App.module.css';
import axios from 'axios';
// component
import Header from './component/Header/Header';
// page
import Signup from './page/signup/Signup';
import Signin from './page/signin/Signin';
import Profile from './page/profile/Profile';
import Main from './page/main/Main';
import NotFound from './page/notfound/NotFound';
function App() {
  const [user, setUser] = useState('');
  const [login ,setLogin] = useState(false);

  const [data, setData] = useState([]);

  const getData = async () => {
    try{
        await axios.get("/todos",{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => 
            {
                setData(Object.values(res.data.datas).map(item => ({
                    ...item,
                    date: item.date.split('T')[0]
                }))
                .sort((date1, date2) => {
                    return new Date(date1.date) - new Date(date2.date);
                }));
            })

        .catch(err => console.error(err.response))

    }catch(err){
        console.error(err);
    }
}

  const check = async (todoId, Completed, title, description, date) => {
      let newCompleted = Completed;

      const confirmCheck = window.confirm("일정을 완료하셨나요?"); 
      if(confirmCheck) {
          newCompleted = true;

          alert("수고하셨습니다 :)");
      } else {
          newCompleted = false;
          alert("체크를 취소합니다.");
      }
      const ymd = date.split('-');
        console.log(newCompleted)

      
      // DB 업데이트
      await axios.put(`/todos/${todoId}`, 
          {   
              title,
              description,
              date: `${ymd[0]}-${ymd[1]}-${ymd[2]}`,
              completed: newCompleted
          },
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          }
      );
      // 데이터 새로고침
      getData();
  };
  useEffect(() => {
        // 페이지 로드 시 토큰 확인
        try{
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                setLogin(true);
                setUser(JSON.parse(savedUser));
                
                // axios 헤더 토큰
                // 모든 Axios 요청에 Authorizotion 헤더를 자동으로 추가하도록 설정 함
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return;
            }

            getData();
        }catch (err) {
            console.error(err);
        }
    }, []); 


  return (
    <main className={Style.main}>
      <BrowserRouter>  
        <Header user={user} login={login} setUser={setUser} setLogin={setLogin} data={data} check={check}/>
        <div className={Style.body}>
          <Routes>
            <Route index element={<Main user = { login } data={data} getData={getData} setData={setData} check={check}/>}/>
            <Route path="/signin" element={<Signin setUser = {setUser} setLogin = {setLogin}/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/profile" element={<Profile />}/>
            {/* 경로 이탕 시 */}
            <Route path='*' element={<NotFound />}/>
          </Routes>
        </div>
        </BrowserRouter>
    </main>
  );
}

export default App;