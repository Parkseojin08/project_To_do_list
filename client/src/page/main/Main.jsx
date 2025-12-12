import { useState } from 'react'
import MainForm from '../../component/form/MainForm'
import MainContent from './MainContent/MainContent'
import MainS from './Main.module.css'
export default function Main({ user, data, getData, check }){
    const [formOpen, setFormOpen] = useState(false);

    const openforms = () => {
        setFormOpen(!formOpen)
    }

    return(
        <div>
            {user ? (
            <div>
                <div className={MainS.btndox}>
                    <button onClick = {openforms}>만들기</button>
                </div>
                <MainForm formOpen={formOpen} getData={getData}/>
                <MainContent user={user} data={data} getData = {getData} check={check}/>
            </div>
            ):(
                <div><p style={{marginTop: "125px"}}>로그인하여 TO DO List를 만들어보세요.</p></div>
            )
            }
        </div>
        )
}