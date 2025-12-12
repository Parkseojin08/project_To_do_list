import { useEffect, useState } from "react";
import axios from "axios";
import EditModal from "../../../component/EditModal/EditModal";
import MainContentS from './MainContent.module.css';


export default function MainContent({ user, data, getData, check }){

    
    const [modalOpen,setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});

    const [searchTitle, setSearchTitle] = useState('');

    useEffect(() => {
        getData()
    },[])

    useEffect(() => {
        getData()
    },[user])


    const todoDelete = async (todo_id) => {
        try{
            if(!window.confirm("정말 삭제해요?")){
                alert("삭제를 취소했습니다.")
                return;
            }
            
            await axios.delete('/todos/'+todo_id,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            })
            alert("삭제되었습니다.");
            getData()
        }catch(err){
            console.error(err)
        }
    }

    return(            
        <div>
            <div className={MainContentS.search}>
                <div className={MainContentS.search_title}>
                    <div className={MainContentS.search_title_box}>
                        <label htmlFor="search" style={{cursor: "pointer"}}>검색: </label>
                        <input type="text" id="search" onChange={(e) => setSearchTitle(e.target.value)} value={searchTitle} placeholder="제목을 검색해 보세요!"/>
                        <button onClick={() => getData(searchTitle,undefined)}>추출</button>
                    </div>
                </div>
                <div className={MainContentS.search_btn}>
                    <button type="button" onClick={() => getData(searchTitle)}>전체 확인</button>
                    <button type="button" onClick={() => getData(searchTitle,true)}>체크 O 확인</button>
                    <button type="button" onClick={() => getData(searchTitle,false)}>체크 X 확인</button>
                </div>
            </div>
            {data.map((data, index) => {
                return(
                    <div key={data.todo_id} className={MainContentS.box} >
                        <div>
                            <label htmlFor={data.todo_id} style={{cursor: "pointer"}}>완료: </label>
                            <input type="checkBox" id={data.todo_id} style={{cursor: "pointer"}} onChange={() => {}} onClick={() => check(data.todo_id, data.completed, data.title, data.description, data.date)} checked={data.completed}/>
                        </div>
                        <div className={MainContentS.box_title}>
                            <h3>{index+1}. {data.title}</h3>
                        </div>
                        <div className={MainContentS.box_description}>
                            <b>내용:</b>
                            <p style={{margin: 0}}>{data.description}</p>
                        </div>
                        <div className={MainContentS.box_date}>
                            <p><b>기한</b>: {data.date.split("T")[0]}까지</p>
                        </div>
                        <div>
                            <button className={MainContentS.btn} onClick={() => {
                                setModalData({todo_id: data.todo_id ,title: data.title, description: data.description, date: data.date.split("T")[0], completed: data.completed});
                                setModalOpen(true);
                                }}>수정</button>                            
                            <button onClick={() => todoDelete(data.todo_id)} className={MainContentS.btn} >삭제</button>
                        </div>
                    </div>
                )
            })}
            {modalOpen && <EditModal modalData={modalData} getData={getData} onClose={() => setModalOpen(false)} />}
        </div>
    )
}