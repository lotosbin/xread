import styles from "./Advice.module.css";
import React, {useContext, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";

export function Advice() {
    const {theme} = useSelector(state => state.theme);
    const [hide, setHide] = useState(false);
    return (<Paper elevation={1} className={styles.advice}>
        <Typography variant="h5" component="h2" onClick={() => setHide(!hide)}>
            帮助我们改进
        </Typography>
        {hide ? null :
            <div className={styles.content}>
                <Typography component="p">
                    点击下方链接，给喜欢的功能投票，或者提出您的建议！
                </Typography>
                <a href="http://feathub.com/lotosbin/xread" target="_blank">
                    <img className={theme === 'dark' ? styles.img_dark : styles.img} src={"http://feathub.com/lotosbin/xread?format=svg"} alt={"advice"}/>
                </a>
            </div>
        }
    </Paper>);
}