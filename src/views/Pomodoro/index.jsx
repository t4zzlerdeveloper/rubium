import { useEffect, useState } from 'react';
import './Pomodoro.css'

import timeIcon from '../../assets/timer.svg'

const pomodoroPhases = [
    {
        "time":25,
        "next": 1
    },
    {
        "rest":true,
        "time":5,
        "next": 2
    },
    {
        "time":25,
        "next": 3
    },
    {
        "rest":true,
        "time":5,
        "next": 4
    },
    {
        "time":25,
        "next": 5
    },
    {
        "rest":true,
        "time":15,
        "next": 0
    },
]

function Pomodoro(){

    const [open,setOpen] = useState(false);
    const [phase,setPhase] = useState(0);
    const [time,setTime] = useState(-1);
    const [timeLeft,setTimeLeft] = useState("00:00");
    let timerInterval;

    useEffect(()=>{
        if (open) {
            initPomodoro();
            timerInterval = setInterval(updateTimeLeft, 250);
        } else {
            clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval); // Clear interval on component unmount
    },[open, phase])

    function parseLeadingZeros(number){
        const n = number.toString();
        return n.length === 1 ? "0" + n : n;
    }

    function updateTimeLeft(){

        var distance = time - Date.now();

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(minutes < 0 || seconds < 0){
            changePomodoroPhase();
            return;
        }

        minutes = parseLeadingZeros(minutes);
        seconds = parseLeadingZeros(seconds);
        
        setTimeLeft(minutes + ":" + seconds);
    }

    function initPomodoro(){
        setTime(Date.now() + pomodoroPhases[phase].time * 1000 * 60);
    }

    function changePomodoroPhase(){
        const nextPhase = pomodoroPhases[phase].next;

        setTime(Date.now() + pomodoroPhases[nextPhase].time * 1000 * 60);
        setPhase(nextPhase);
    }

    function handleOpen(){
        if(!open){
            initPomodoro();
        }
        setOpen(!open);
    }

    return (
        <div className={'pomodoro-sm'}>
            <img className={!open ? "pmd-white" : pomodoroPhases[phase].rest ? "pmd-green" : ""} src={timeIcon} onClick={handleOpen}/>
            {open ? 
                <>
                    <h3>{timeLeft}</h3>
                    <p>{phase > -1 && pomodoroPhases[phase].rest ? "Rest for" : "Work for"}</p>
                </>
                : <></>
            }
        </div>
    );
}

export default Pomodoro;
