import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderS from './Header.module.css';

export default function Header({ user, login, setUser, setLogin, data, check}){
    const [open, setOpen] = useState(false);
    const move = useNavigate()
    
    const openControl = () => {
        setOpen(!open)
    }

    const LOGOUT = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser('');
        setLogin(false);
        move('/signin')
    }

    return(
        <header>
            <div className={HeaderS.box}>
                <div className={HeaderS.bundle}>
                    <div className={`${HeaderS.menu} ${HeaderS.curser}`}>
                        <span className="material-symbols-outlined" onClick={openControl}>
                            menu
                        </span>
                    </div>
                    <div className={HeaderS.title}>
                        <h1 className={HeaderS.curser} onClick={() => move("/")}>TO-DO</h1>
                    </div>
                </div>
                <div className={HeaderS.bundle}>
                    {!login ? (
                    <div className={HeaderS.bundle}>
                        <div className={HeaderS.login}>
                            <button onClick={() => move('/signin')}>로그인</button>
                        </div>
                        <div className={HeaderS.join}>
                            <button onClick={() => move('/signup')}>회원가입</button>
                        </div>
                    </div>
                    )
                    :
                    (
                    <div className={HeaderS.bundle}>
                        <div className={HeaderS.profile}>
                            <button onClick={() => move('/profile')}>{user.username}</button>
                        </div>
                        <div className={HeaderS.logout}>
                            <button onClick={LOGOUT}>로그아웃</button>
                        </div>
                    </div>
                    )}
                </div>
                <div className={`${HeaderS.subBox} ${open ? HeaderS.open : ''}`}>
                    {login? (
                    <div className={HeaderS.content}>
                        <div className={HeaderS.content_title}>
                            <h2>To-Do List</h2>
                        </div>
                        <div className={HeaderS.content_list}>
                            {data.map((data, index) => {
                                return(
                                    <div key={data.todo_id}className={HeaderS.content_data_box}>
                                        <div className={HeaderS.content_data_title}>
                                            <h3>{index+1}. {data.title} <input type="checkbox" checked={data.completed} onChange={() => {}} onClick={() => check(data.todo_id, data.completed, data.title, data.description, data.date)}/></h3>
                                        </div>
                                        <div className={HeaderS.content_data_date}>
                                            <p>{data.date.split("T")[0]}까지</p>
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                       <div className={HeaderS.content_bundle}>
                            <div className={HeaderS.profile}>
                                <button onClick={() => move('/profile')}>{user.username}</button>
                            </div>
                            <div className={HeaderS.logout}>
                                <button onClick={LOGOUT}>로그아웃</button>
                            </div>
                        </div>
                    </div>
                    ):(
                    <div className={HeaderS.content_bundle}>
                        <div className={HeaderS.login}>
                            <button onClick={() => move('/signin')}>로그인</button>
                        </div>
                        <div className={HeaderS.join}>
                            <button onClick={() => move('/signup')}>회원가입</button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </header>
    )
}