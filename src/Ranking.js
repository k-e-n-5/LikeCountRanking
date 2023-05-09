import React, {useState, useEffect} from "react";

function Ranking() {

    const [user, setUser] = useState("TEST");

    useEffect(() => {
        fetch('/test')
        .then((res) => res.json())
        .then((data) => setUser(data.test.name));    
    },[])

    return (
        <div>
            <label>{user}</label>
        </div>
    );
}

export default Ranking;
