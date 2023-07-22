import React, {useState, useEffect} from "react";
import "./Ranking.css";
import logo_js from "./js_logo_symbol.jpg"

function Ranking() {

    const [dbData, setDbData] = useState([]);
    let count = 1;

    useEffect(() => {
        fetch('/dbTest')
        .then((res) => res.json())
        .then((data) => setDbData(data.dbData));
    },[])

    return (
        <div className="style_a">
            <h1>
                <label>Japan System</label>
                <br></br>
                <label>JS Token Ranking!</label>
            </h1>
            {/*JSON形式で受け取ったオブジェクトを表示させる方法*/}

            <div className="style_b">
                <table>
                    <tbody>
                    <tr class="h_table">  
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Token</th>
                    </tr >
                    {dbData.map((data) => (
                    <tr key={data.postUser} style={{listStyleType:"none"}} >
                    <td>{count++}</td><td>{data.postUser}</td><td>{data.likeCount}</td>
                    </tr>))}


                    <tr>
                        
                    </tr>




                </tbody>
            </table>
            </div>
            <br></br>
            <img src={logo_js} alt="logo_js" width="150px" />

        </div>
    );
}

export default Ranking;
