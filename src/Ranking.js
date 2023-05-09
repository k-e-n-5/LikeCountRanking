import React, {useState, useEffect} from "react";

function Ranking() {

    const [dbData, setDbData] = useState([]);

    useEffect(() => {
        fetch('/dbTest')
        .then((res) => res.json())
        .then((data) => setDbData(data.dbData));
    },[])

    return (
        <div>
            <label>TEST</label>
            
            {/*JSON形式で受け取ったオブジェクトを表示させる方法*/}
	        <ul>{dbData.map((data) => (
	            <li key={data.postUser} style={{listStyleType:"none"}}>
		            {data.postUser} {data.likeCount}
	            </li>
            ))}</ul>
        </div>
    );
}

export default Ranking;
