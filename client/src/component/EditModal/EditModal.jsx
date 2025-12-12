import { useState } from 'react';
import EditModalS from './EditModal.module.css';
import axios from 'axios';
//https://ko.javascript.info/bubbling-and-capturing 모달
export default function EditModal({ modalData ,onClose, getData }) {

    const {todo_id, title, description, date, completed} = modalData;
    const [Etitle, setEtitle] = useState();
    const [Edescription, setEdescription] = useState();
    const [Edate, setEdate] = useState();

    const Edit = async () => {
        try{
            if(Etitle === title && Edescription === description && Edate === date){
                alert("변경된 사항이 없습니다.");
                return; 
            }
            const response = await axios.put(`/todos/${todo_id}`,
                        {
                            title: Etitle,
                            description: Edescription,
                            date: Edate,
                            completed
                        }
                        ,{
                            headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }}
            ).then(res => {alert(`수정 완료!`); getData()})
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div className={EditModalS.modalOverlay} onClick={onClose}>
            <div className={EditModalS.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={EditModalS.title}>
                    <h2>TODO 수정</h2>
                </div>
                <div className={EditModalS.title_info}>
                    <label htmlFor="title">제목: </label>
                    <input type="text" id="titie" onChange={(e) => setEtitle(e.target.value)} value={Etitle} placeholder={"기존 제목: "+title}/>
                </div>
                <div className={EditModalS.title_info}>
                    <label htmlFor="description">내용: </label>
                    <input type="text" id="description" onChange={(e) => setEdescription(e.target.value)} value={Edescription} placeholder={"기존 내용: "+description}/>
                </div>
                <div className={EditModalS.title_info}>
                    <label htmlFor="date">기한: </label>
                    <input type="date" id="date" onChange={(e) => setEdate(e.target.value)} value={Edate} />
                    <p><i>기존 날짜: {date}</i></p>
                </div>
                <div className={EditModalS.btn}>
                    <button type="button" onClick={Edit}>수정</button>
                </div>
            </div>
        </div>
    );
}