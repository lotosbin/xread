import styles from "./Advice.module.css";
import React, {useContext, useState} from "react";
import ThemeContext from "../contexts/ThemeContext";

export function Advice() {
    const {theme} = useContext(ThemeContext);
    const [hide, setHide] = useState(false)
    return <div className={styles.advice}>
        <h2 onClick={() => setHide(!hide)}>帮助我们改进 </h2>
        {hide ? null : <div className={styles.content}>
            <p>点击下方链接，给喜欢的功能投票，或者提出您的建议！</p>
            <a href="http://feathub.com/lotosbin/xread">
                <img className={theme === 'dark' ? styles.img_dark : styles.img} src={"http://feathub.com/lotosbin/xread?format=svg"}/>
            </a>
        </div>
        }
    </div>;
}