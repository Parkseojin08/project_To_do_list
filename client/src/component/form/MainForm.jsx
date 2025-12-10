import { useState } from 'react';
import FormS from './MainForm.module.css';
import axios from 'axios';

export default function MainForm({ formOpen,  getData }){
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const inputData = async () => {
        try{

            if(localStorage.getItem("token") === null){
                return;
            }

            const ymd = date.split('-');

            const response = await axios.post('/todos',
                {
                    title,
                    description,
                    date: `${ymd[0]}-${ymd[1]}-${ymd[2]}`,
                },{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            ).then(() => {
                        alert(`todo 추가 성공
            제목: ${title}
            내용: ${description}
            기한: ${date}`)
            })
            getData()
        }catch(err){
            console.error(err)
        }
    }


    return(
        <form className={`${FormS.form} ${formOpen ? FormS.open : ''}`}>
            <div className={FormS.box_title}>
                <h1>To Do를 생성해 보세요!</h1>
            </div>
            <div className={FormS.input_box}>
                <div className={FormS.title}>
                    <label htmlFor="title">제목: </label>
                    <input type="text" id="title" onChange={(e) => setTitle(e.target.value)} value={title} placeholder='제목을 입력해주세요!'/>
                </div>
                <div className={FormS.description}>
                    <label htmlFor="description">내용: </label>
                    <input type="text" id="description" onChange={(e) => setDescription(e.target.value)} value={description} placeholder='제목을 입력해주세요!'/>
                </div>
                <div className={FormS.date}>
                    <label htmlFor="deadline">기한: </label>
                    <input type="date" id="deadline" onChange={(e) => setDate(e.target.value)} value={date} placeholder='제목을 입력해주세요!'/>
                </div>
            </div>
            <div className={FormS.btn}>
                <button type='button' onClick={inputData}>생성</button>
            </div>
        </form>
    )
}