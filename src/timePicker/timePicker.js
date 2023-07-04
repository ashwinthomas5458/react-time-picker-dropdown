import React, { useRef, useState, useEffect } from "react";
import './timePicker.css';

const SIXTY_MAP = {"10":{"label":"10","value":11,"index":10},"11":{"label":"11","value":12,"index":11},"12":{"label":"12","value":13,"index":12},"13":{"label":"13","value":14,"index":13},"14":{"label":"14","value":15,"index":14},"15":{"label":"15","value":16,"index":15},"16":{"label":"16","value":17,"index":16},"17":{"label":"17","value":18,"index":17},"18":{"label":"18","value":19,"index":18},"19":{"label":"19","value":20,"index":19},"20":{"label":"20","value":21,"index":20},"21":{"label":"21","value":22,"index":21},"22":{"label":"22","value":23,"index":22},"23":{"label":"23","value":24,"index":23},"24":{"label":"24","value":25,"index":24},"25":{"label":"25","value":26,"index":25},"26":{"label":"26","value":27,"index":26},"27":{"label":"27","value":28,"index":27},"28":{"label":"28","value":29,"index":28},"29":{"label":"29","value":30,"index":29},"30":{"label":"30","value":31,"index":30},"31":{"label":"31","value":32,"index":31},"32":{"label":"32","value":33,"index":32},"33":{"label":"33","value":34,"index":33},"34":{"label":"34","value":35,"index":34},"35":{"label":"35","value":36,"index":35},"36":{"label":"36","value":37,"index":36},"37":{"label":"37","value":38,"index":37},"38":{"label":"38","value":39,"index":38},"39":{"label":"39","value":40,"index":39},"40":{"label":"40","value":41,"index":40},"41":{"label":"41","value":42,"index":41},"42":{"label":"42","value":43,"index":42},"43":{"label":"43","value":44,"index":43},"44":{"label":"44","value":45,"index":44},"45":{"label":"45","value":46,"index":45},"46":{"label":"46","value":47,"index":46},"47":{"label":"47","value":48,"index":47},"48":{"label":"48","value":49,"index":48},"49":{"label":"49","value":50,"index":49},"50":{"label":"50","value":51,"index":50},"51":{"label":"51","value":52,"index":51},"52":{"label":"52","value":53,"index":52},"53":{"label":"53","value":54,"index":53},"54":{"label":"54","value":55,"index":54},"55":{"label":"55","value":56,"index":55},"56":{"label":"56","value":57,"index":56},"57":{"label":"57","value":58,"index":57},"58":{"label":"58","value":59,"index":58},"59":{"label":"59","value":60,"index":59},"00":{"label":"00","value":1,"index":0},"01":{"label":"01","value":2,"index":1},"02":{"label":"02","value":3,"index":2},"03":{"label":"03","value":4,"index":3},"04":{"label":"04","value":5,"index":4},"05":{"label":"05","value":6,"index":5},"06":{"label":"06","value":7,"index":6},"07":{"label":"07","value":8,"index":7},"08":{"label":"08","value":9,"index":8},"09":{"label":"09","value":10,"index":9}};
const MERIDIAN_MAP = {"am": {"label": "am", "value": 1, "index": 0 }, "pm": {"label": "pm", "value": 2, "index": 1}};
const TWELVE_MAP = {"10":{"label":"10","value":10,"index":9},"11":{"label":"11","value":11,"index":10},"12":{"label":"12","value":12,"index":11},"01":{"label":"01","value":1,"index":0},"02":{"label":"02","value":2,"index":1},"03":{"label":"03","value":3,"index":2},"04":{"label":"04","value":4,"index":3},"05":{"label":"05","value":5,"index":4},"06":{"label":"06","value":6,"index":5},"07":{"label":"07","value":7,"index":6},"08":{"label":"08","value":8,"index":7},"09":{"label":"09","value":9,"index":8}};
const SIXTY_LIST = [{"label":"00","value":1,"index":0},{"label":"01","value":2,"index":1},{"label":"02","value":3,"index":2},{"label":"03","value":4,"index":3},{"label":"04","value":5,"index":4},{"label":"05","value":6,"index":5},{"label":"06","value":7,"index":6},{"label":"07","value":8,"index":7},{"label":"08","value":9,"index":8},{"label":"09","value":10,"index":9},{"label":"10","value":11,"index":10},{"label":"11","value":12,"index":11},{"label":"12","value":13,"index":12},{"label":"13","value":14,"index":13},{"label":"14","value":15,"index":14},{"label":"15","value":16,"index":15},{"label":"16","value":17,"index":16},{"label":"17","value":18,"index":17},{"label":"18","value":19,"index":18},{"label":"19","value":20,"index":19},{"label":"20","value":21,"index":20},{"label":"21","value":22,"index":21},{"label":"22","value":23,"index":22},{"label":"23","value":24,"index":23},{"label":"24","value":25,"index":24},{"label":"25","value":26,"index":25},{"label":"26","value":27,"index":26},{"label":"27","value":28,"index":27},{"label":"28","value":29,"index":28},{"label":"29","value":30,"index":29},{"label":"30","value":31,"index":30},{"label":"31","value":32,"index":31},{"label":"32","value":33,"index":32},{"label":"33","value":34,"index":33},{"label":"34","value":35,"index":34},{"label":"35","value":36,"index":35},{"label":"36","value":37,"index":36},{"label":"37","value":38,"index":37},{"label":"38","value":39,"index":38},{"label":"39","value":40,"index":39},{"label":"40","value":41,"index":40},{"label":"41","value":42,"index":41},{"label":"42","value":43,"index":42},{"label":"43","value":44,"index":43},{"label":"44","value":45,"index":44},{"label":"45","value":46,"index":45},{"label":"46","value":47,"index":46},{"label":"47","value":48,"index":47},{"label":"48","value":49,"index":48},{"label":"49","value":50,"index":49},{"label":"50","value":51,"index":50},{"label":"51","value":52,"index":51},{"label":"52","value":53,"index":52},{"label":"53","value":54,"index":53},{"label":"54","value":55,"index":54},{"label":"55","value":56,"index":55},{"label":"56","value":57,"index":56},{"label":"57","value":58,"index":57},{"label":"58","value":59,"index":58},{"label":"59","value":60,"index":59}];
const TWENTY_FOUR_LIST = [{"label":"00","value":1,"index":0},{"label":"01","value":2,"index":1},{"label":"02","value":3,"index":2},{"label":"03","value":4,"index":3},{"label":"04","value":5,"index":4},{"label":"05","value":6,"index":5},{"label":"06","value":7,"index":6},{"label":"07","value":8,"index":7},{"label":"08","value":9,"index":8},{"label":"09","value":10,"index":9},{"label":"10","value":11,"index":10},{"label":"11","value":12,"index":11},{"label":"12","value":13,"index":12},{"label":"13","value":14,"index":13},{"label":"14","value":15,"index":14},{"label":"15","value":16,"index":15},{"label":"16","value":17,"index":16},{"label":"17","value":18,"index":17},{"label":"18","value":19,"index":18},{"label":"19","value":20,"index":19},{"label":"20","value":21,"index":20},{"label":"21","value":22,"index":21},{"label":"22","value":23,"index":22},{"label":"23","value":24,"index":23}];
const TWELVE_LIST = [{"label":"01","value":1,"index":0},{"label":"02","value":2,"index":1},{"label":"03","value":3,"index":2},{"label":"04","value":4,"index":3},{"label":"05","value":5,"index":4},{"label":"06","value":6,"index":5},{"label":"07","value":7,"index":6},{"label":"08","value":8,"index":7},{"label":"09","value":9,"index":8},{"label":"10","value":10,"index":9},{"label":"11","value":11,"index":10},{"label":"12","value":12,"index":11}];
const MERDIAN_LIST = [{ "label": "am", "value": 1, "index": 0 }, { "label": "pm", "value": 2, "index": 1 }];

const TimePicker = ({
    placeholder,
    showCloseIcon = true,
    showClockIcon = true,
    useTwelveHourFormat = false,
    allowBackdrop =false,
    defaultValue,
    onTimeChange,
    onInputChange
}) => {

    const [selectedText, setSelectedText] = useState("");
    const [displayText, setDisplayText] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [hour, setHour] = useState(null);
    const [minute, setMinute] = useState(null);
    const [second, setSecond] = useState(null);
    const [meridian, setMeridian] = useState(null);
    const hourWrapper = useRef(null);
    const minuteWrapper = useRef(null);
    const secondWrapper = useRef(null);
    const meridianWrapper = useRef(null);
    const inputRef = useRef(null);

    const changeHandler = (e) => {
        let value = e.target.value;
        setDisplayText(value);
    }

    const checkIfNumber=(value)=>{
        const exp = /^\d+$/;
        return exp.test(value.trim());
    }

    const getTimeValue=(val)=>{
        let value;
        let currentText = val.split(":");
        let h; let m; let s; let a;
        let hour; let minute; let second; let meridian;
        if(useTwelveHourFormat && currentText.length===3 && (currentText[2]?.toLowerCase()?.includes("am")|| currentText[2]?.toLowerCase()?.includes("pm"))){
            let merd = "am";
            if(currentText[2]?.toLowerCase()?.includes("pm")) merd = "pm";
            let secondText = currentText[2].toLowerCase().replace(merd, "");
            if(checkIfNumber(currentText[0]) && 0<Number(currentText[0]) && Number(currentText[0])<=12){
                h = currentText[0];
                hour = TWELVE_MAP[currentText[0].trim()]?.value? TWELVE_MAP[currentText[0].trim()] : null
            }
            if(checkIfNumber(currentText[1]) && 0<=Number(currentText[1]) && Number(currentText[1])<=59){
                m = currentText[1];
                minute = SIXTY_MAP[currentText[1].trim()]?.value? SIXTY_MAP[currentText[1].trim()] : null
            }
            if(checkIfNumber(secondText) && 0<=Number(secondText) && Number(secondText)<=59){
                s = secondText;
                second = SIXTY_MAP[secondText.trim()]?.value? SIXTY_MAP[secondText.trim()] : null
            }
            if(MERIDIAN_MAP[merd]){
                a = merd;
                meridian = MERIDIAN_MAP[merd.trim()]?.value? MERIDIAN_MAP[merd.trim()] : null
            }

            if(hour && minute && second && meridian){
                setHour(hour);
                setMinute(minute);
                setSecond(second);
                setMeridian(meridian);
                value = `${h} : ${m} : ${s} ${a}`;
            }
            else{
                value = selectedText;
                setDisplayText(value);
            }
        }
        else if(!useTwelveHourFormat && currentText.length===3){
            if(checkIfNumber(currentText[0]) && 0<=Number(currentText[0]) && Number(currentText[0])<=23){
                h = currentText[0];
                hour = SIXTY_MAP[currentText[0].trim()]?.value? SIXTY_MAP[currentText[0].trim()] : null
            }
            if(checkIfNumber(currentText[1]) && 0<=Number(currentText[1]) && Number(currentText[1])<=59){
                m = currentText[1];
                minute = SIXTY_MAP[currentText[1].trim()]?.value? SIXTY_MAP[currentText[1].trim()] : null
            }
            if(checkIfNumber(currentText[2]) && 0<=Number(currentText[2]) && Number(currentText[2])<=59){
                s = currentText[2];
                second = SIXTY_MAP[currentText[2].trim()]?.value? SIXTY_MAP[currentText[2].trim()] : null
            }

            if(hour && minute && second){
                setHour(hour);
                setMinute(minute);
                setSecond(second);
                value = `${h} : ${m} : ${s}`;
            }
            else{
                value = selectedText;
                setDisplayText(value);
            }
        }
        else{
            value = selectedText;
            setDisplayText(value);
        }
        return value;
    }

    const applyChanges=()=>{
        let value = displayText;
        if(selectedText!= displayText) value = getTimeValue(displayText);
        try {
           if(value) onTimeChange(value);
           else onTimeChange(null);
        } catch (error) {}
    }

    const handleCloseIconClick=()=>{
        setShowDropdown(false);
        setHour(null);
        setMinute(null);
        setSecond(null);
        setMeridian(null);
        setSelectedText("");
        setDisplayText("");
        try {
            onTimeChange(null);
        } catch (error) {}
    }

    const handleClockIconClick=()=>{
        if(showDropdown){
            applyChanges();
            setShowDropdown(false);
        }
        else inputRef.current.focus();
    }

    const keyDownHandler = (e) => {
        let hoursWrapper = hourWrapper.current;
        let hours = hoursWrapper.children;
        let hrIndex = hour?.value ? hour.index : -1;
        if (e.keyCode === 40 || e.key === "ArrowDown") {
            e.preventDefault();
            if (hrIndex === -1) hrIndex = 0;
            hours[hrIndex].focus();
            setHour(useTwelveHourFormat ? TWELVE_LIST[hrIndex] : TWENTY_FOUR_LIST[hrIndex]);
        }
        else if (e.keyCode === 38 || e.key === "ArrowUp") {
            e.preventDefault();
            if (hrIndex === -1) hrIndex = hours.length - 1;
            hours[hrIndex].focus();
            setHour(useTwelveHourFormat ? TWELVE_LIST[hrIndex] : TWENTY_FOUR_LIST[hrIndex]);
        }
        else if (e.keyCode === 13 || e.key === "Enter") {
            applyChanges();
            setShowDropdown(false);
        }
        else if (e.keyCode === 27 || e.key === "Escape") { 
            applyChanges();
            setShowDropdown(false);
        }
    }

    const hourKeyDownHandler=(e, option)=>{
        let hoursWrapper = hourWrapper.current;
        let minutesWrapper = minuteWrapper.current;
        let secondsWrapper = secondWrapper.current;
        let meridiansWrapper = meridianWrapper?.current;
        let hrIndex = option.index;
        let minIndex = minute?.value? minute.index: -1;
        let secIndex = second?.value? second.index: -1;
        let merdIndex = meridian?.value? meridian.index: -1;
        let hours = hoursWrapper.children;
        let minutes = minutesWrapper.children;
        let seconds = secondsWrapper.children;
        let meridians = meridiansWrapper?.children;
        if (e.keyCode === 40 || e.key === "ArrowDown") {
            e.preventDefault();
            hrIndex = hrIndex + 1;
            if (hrIndex === hours.length) hrIndex = 0;
            hours[hrIndex].focus();
            setHour(useTwelveHourFormat ? TWELVE_LIST[hrIndex] : TWENTY_FOUR_LIST[hrIndex]);
        }
        else if (e.keyCode === 38 || e.key === "ArrowUp") {
            e.preventDefault();
            hrIndex = hrIndex - 1;
            if (hrIndex < 0) hrIndex = hours.length - 1;
            hours[hrIndex].focus();
            setHour(useTwelveHourFormat ? TWELVE_LIST[hrIndex] : TWENTY_FOUR_LIST[hrIndex]);
        }
        else if (e.keyCode === 39 || e.key === "ArrowRight") {
            e.preventDefault();
            if (minIndex === -1) minIndex = 0;
            minutes[minIndex].focus();
            setMinute(SIXTY_LIST[minIndex]);
        }
        else if (e.keyCode === 37 || e.key === "ArrowLeft") {
            e.preventDefault();
            if(useTwelveHourFormat){
                if (merdIndex === -1) merdIndex = 0;
                meridians[merdIndex].focus();
                setMeridian(MERDIAN_LIST[merdIndex]);
            }
            else{
                e.preventDefault();
                if (secIndex === -1) secIndex = 0;
                seconds[secIndex].focus();
                setSecond(SIXTY_LIST[secIndex]);
            }
        }
        else if (e.keyCode === 13 || e.key === "Enter") {
            applyChanges();
            setShowDropdown(false);
        }
        else if (e.keyCode === 27 || e.key === "Escape") { 
            applyChanges();
            setShowDropdown(false);
        }
    }

    const minKeyDownHandler=(e, option)=>{
        let hoursWrapper = hourWrapper.current;
        let minutesWrapper = minuteWrapper.current;
        let secondsWrapper = secondWrapper.current;
        let hrIndex = hour?.value? hour.index: -1;
        let minIndex = option.index;
        let secIndex = second?.value? second.index: -1;
        let hours = hoursWrapper.children;
        let minutes = minutesWrapper.children;
        let seconds = secondsWrapper.children;
        if (e.keyCode === 40 || e.key === "ArrowDown") {
            e.preventDefault();
            minIndex = minIndex + 1;
            if (minIndex === minutes.length) minIndex = 0;
            minutes[minIndex].focus();
            setMinute(SIXTY_LIST[minIndex]);
        }
        else if (e.keyCode === 38 || e.key === "ArrowUp") {
            e.preventDefault();
            minIndex = minIndex - 1;
            if (minIndex < 0) minIndex = minutes.length - 1;
            minutes[minIndex].focus();
            setMinute(SIXTY_LIST[minIndex]);
        }
        else if (e.keyCode === 39 || e.key === "ArrowRight") {
            e.preventDefault();
            if (secIndex === -1) secIndex = 0;
            seconds[secIndex].focus();
            setSecond(SIXTY_LIST[secIndex]);
        }
        else if (e.keyCode === 37 || e.key === "ArrowLeft") {
            e.preventDefault();
            if (hrIndex === -1) hrIndex = 0;
            hours[hrIndex].focus();
            setHour(useTwelveHourFormat ? TWELVE_LIST[hrIndex] : TWENTY_FOUR_LIST[hrIndex]);
        }
        else if (e.keyCode === 13 || e.key === "Enter") {
            applyChanges();
            setShowDropdown(false);
        }
        else if (e.keyCode === 27 || e.key === "Escape") { 
            applyChanges();
            setShowDropdown(false);
        }
    } 
    
    const secKeyDownHandler=(e, option)=>{
        let hoursWrapper = hourWrapper.current;
        let minutesWrapper = minuteWrapper.current;
        let secondsWrapper = secondWrapper.current;
        let meridiansWrapper = meridianWrapper?.current;
        let hrIndex = hour?.value? hour.index: -1;
        let minIndex = minute?.value? minute.index: -1;
        let secIndex = option.index;
        let merdIndex = meridian?.value? meridian.index: -1;
        let hours = hoursWrapper.children;
        let minutes = minutesWrapper.children;
        let seconds = secondsWrapper.children;
        let meridians = meridiansWrapper?.children;
        if (e.keyCode === 40 || e.key === "ArrowDown") {
            e.preventDefault();
            secIndex = secIndex + 1;
            if (secIndex === seconds.length) secIndex = 0;
            seconds[secIndex].focus();
            setSecond(SIXTY_LIST[secIndex]);
        }
        else if (e.keyCode === 38 || e.key === "ArrowUp") {
            e.preventDefault();
            secIndex = secIndex - 1;
            if (secIndex < 0) secIndex = seconds.length - 1;
            seconds[secIndex].focus();
            setSecond(SIXTY_LIST[secIndex]);
        }
        else if (e.keyCode === 39 || e.key === "ArrowRight") {
            if(useTwelveHourFormat){
                e.preventDefault();
                if (merdIndex === -1) merdIndex = 0;
                meridians[merdIndex].focus();
                setMeridian(MERDIAN_LIST[merdIndex]);
            }
            else{
                e.preventDefault();
                if (hrIndex === -1) hrIndex = 0;
                hours[hrIndex].focus();
                setHour(TWENTY_FOUR_LIST[hrIndex]);
            }
        }
        else if (e.keyCode === 37 || e.key === "ArrowLeft") {
            e.preventDefault();
            if (minIndex === -1) minIndex = 0;
            minutes[minIndex].focus();
            setMinute(SIXTY_LIST[minIndex]);
        }
        else if (e.keyCode === 13 || e.key === "Enter") {
            applyChanges();
            setShowDropdown(false);
        }
        else if (e.keyCode === 27 || e.key === "Escape") { 
            applyChanges();
            setShowDropdown(false);
        }
    }

    const merdKeyDownHandler=(e, option)=>{
        let hoursWrapper = hourWrapper.current;
        let secondsWrapper = secondWrapper.current;
        let meridiansWrapper = meridianWrapper.current;
        let hrIndex = hour?.value? hour.index: -1;
        let secIndex = second?.value? second.index: -1;
        let merdIndex = option.index;
        let hours = hoursWrapper.children;
        let seconds = secondsWrapper.children;
        let meridians = meridiansWrapper.children;
        if (e.keyCode === 40 || e.key === "ArrowDown") {
            e.preventDefault();
            merdIndex = merdIndex + 1;
            if (merdIndex === meridians.length) merdIndex = 0;
            meridians[merdIndex].focus();
            setMeridian(MERDIAN_LIST[merdIndex]);
        }
        else if (e.keyCode === 38 || e.key === "ArrowUp") {
            e.preventDefault();
            merdIndex = merdIndex - 1;
            if (merdIndex < 0) merdIndex = meridians.length - 1;
            meridians[merdIndex].focus();
            setMeridian(MERDIAN_LIST[merdIndex]);
        }
        else if (e.keyCode === 39 || e.key === "ArrowRight") {
            e.preventDefault();
            if (hrIndex === -1) hrIndex = 0;
            hours[hrIndex].focus();
            setHour(useTwelveHourFormat ? TWELVE_LIST[hrIndex] : TWENTY_FOUR_LIST[hrIndex]);
        }
        else if (e.keyCode === 37 || e.key === "ArrowLeft") {
            e.preventDefault();
            if (secIndex === -1) secIndex = 0;
            seconds[secIndex].focus();
            setSecond(SIXTY_LIST[secIndex]);
        }
        else if (e.keyCode === 13 || e.key === "Enter") {
            applyChanges();
            setShowDropdown(false);
        }
        else if (e.keyCode === 27 || e.key === "Escape") { 
            applyChanges();
            setShowDropdown(false);
        }
    }

    const handleButtonClick=()=>{
        applyChanges();
        setShowDropdown(false);
    }

    const setOptionValue=(e, key, option)=>{
        let hoursWrapper = hourWrapper.current;
        let minutesWrapper = minuteWrapper.current;
        let secondsWrapper = secondWrapper.current;
        let meridiansWrapper = meridianWrapper?.current;
        let hours = hoursWrapper.children;
        let minutes = minutesWrapper.children;
        let seconds = secondsWrapper.children;
        let meridians = meridiansWrapper?.children;
        let optionIndex = option.index
        switch (key) {
            case "h":{
                hours[optionIndex].focus();
                setHour(useTwelveHourFormat ? TWELVE_LIST[optionIndex] : TWENTY_FOUR_LIST[optionIndex]);
                break;
            }
            case "m":{
                minutes[optionIndex].focus();
                setMinute(SIXTY_LIST[optionIndex]);
                break;
            }
            case "s":{
                seconds[optionIndex].focus();
                setSecond(SIXTY_LIST[optionIndex]);
                break;
            }
            case "a":{
                meridians[optionIndex].focus();
                setMeridian(MERDIAN_LIST[optionIndex]);
                break;
            }
        }
    }

    useEffect(() => {
        let h = useTwelveHourFormat? "01":"00"; let m = "00"; let s = "00"; let a = "am";
        if (hour?.value) h = hour.label;
        if (minute?.value) m = minute.label;
        if (second?.value) s = second.label;
        if (meridian?.value) a = meridian.label;
        if (hour || minute || second || meridian){
            let value = `${h} : ${m} : ${s}${useTwelveHourFormat? ` ${a}`: ""}`
            setSelectedText(value);
            setDisplayText(value);
            try {
                onInputChange(value);
            } catch (error) {}
        }

    }, [hour, minute, second, meridian]);

    const onFocusHandler = (e) => {
        setShowDropdown(true);
    }

    useEffect(()=>{
        if(defaultValue) getTimeValue(defaultValue);
    },[defaultValue]);

    return (
        <div className="tp_outerWrapper">
            <div className="tp_mainWrapper">
                <div className="tp_inputWrapper">
                    <input
                        className="tp_inputBox"
                        type="text"
                        value={displayText}
                        ref={inputRef}
                        onChange={changeHandler}
                        onKeyDown={keyDownHandler}
                        placeholder={placeholder? placeholder: useTwelveHourFormat? "00 : 00 : 00 am": "00 : 00 : 00"}
                        onFocus={onFocusHandler}
                    />
                    {
                        showCloseIcon && (
                            <div className="tp_closeIconWrapper tp_iconWrapper">
                                <svg className="tp_closeIcon tp_icon" onClick={handleCloseIconClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.8333 5.34166L14.6583 4.16666L9.99999 8.825L5.34166 4.16666L4.16666 5.34166L8.82499 10L4.16666 14.6583L5.34166 15.8333L9.99999 11.175L14.6583 15.8333L15.8333 14.6583L11.175 10L15.8333 5.34166Z" fill="#323232" />
                                </svg>
                            </div>
                        )
                    }
                    {
                        showClockIcon && (
                            <div className="tp_clockIconWrapper tp_iconWrapper">
                                <svg className="tp_clockIcon tp_icon" onClick={handleClockIconClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.99166 1.66666C5.39166 1.66666 1.66666 5.4 1.66666 10C1.66666 14.6 5.39166 18.3333 9.99166 18.3333C14.6 18.3333 18.3333 14.6 18.3333 10C18.3333 5.4 14.6 1.66666 9.99166 1.66666ZM9.99999 16.6667C6.31666 16.6667 3.33332 13.6833 3.33332 10C3.33332 6.31666 6.31666 3.33333 9.99999 3.33333C13.6833 3.33333 16.6667 6.31666 16.6667 10C16.6667 13.6833 13.6833 16.6667 9.99999 16.6667ZM10.4167 5.83333H9.16666V10.8333L13.5417 13.4583L14.1667 12.4333L10.4167 10.2083V5.83333Z" fill="#323232" />
                                </svg>
                            </div>
                        )
                    }
                </div>
                <div className={showDropdown ? "tp_dropdownWrapper tp_dropdownActive" : "tp_dropdownWrapper"}>
                    <div className="tp_optionsContainer">
                        <div className="tp_hoursWrapper tp_optionWrapper">
                            <div className="tp_hoursOptions tp_options" ref={hourWrapper}>
                                {
                                    useTwelveHourFormat && TWELVE_LIST.map((option)=>(
                                        <div className={hour?.value && hour.index===option.index? "tp_option tp_option_selected":"tp_option"} key={`hour-option-${option.value}`} tabIndex={0} data-target-index={option.index} onKeyDown={e=>hourKeyDownHandler(e, option)} onClick={e=>setOptionValue(e, "h", option)}>{option.label}</div>
                                    ))
                                }
                                {
                                    !useTwelveHourFormat && TWENTY_FOUR_LIST.map((option)=>(
                                        <div className={hour?.value && hour.index===option.index? "tp_option tp_option_selected":"tp_option"} key={`hour-option-${option.value}`} tabIndex={0} data-target-index={option.index} onKeyDown={e=>hourKeyDownHandler(e, option)} onClick={e=>setOptionValue(e, "h", option)}>{option.label}</div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="tp_minutesWrapper tp_optionWrapper">
                            <div className="tp_minutesOptions tp_options" ref={minuteWrapper}>
                                {
                                    SIXTY_LIST.map((option)=>(
                                        <div className={minute?.value && minute.index===option.index? "tp_option tp_option_selected":"tp_option"} key={`min-option-${option.value}`} tabIndex={0} data-target-index={option.index} onKeyDown={e=>minKeyDownHandler(e, option)} onClick={e=>setOptionValue(e, "m", option)}>{option.label}</div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="tp_secondWrapper tp_optionWrapper">
                            <div className="tp_secondOptions tp_options" ref={secondWrapper}>
                                {
                                    SIXTY_LIST.map((option)=>(
                                        <div className={second?.value && second.index===option.index? "tp_option tp_option_selected":"tp_option"} key={`sec-option-${option.value}`} tabIndex={0} data-target-index={option.index} onKeyDown={e=>secKeyDownHandler(e, option)} onClick={e=>setOptionValue(e, "s", option)}>{option.label}</div>
                                    ))
                                }
                            </div>
                        </div>
                        {
                            useTwelveHourFormat && (
                                <div className="tp_meridianWapper tp_optionWrapper">
                            <div className="tp_meridianOptions tp_options" ref={meridianWrapper}>
                                {
                                    MERDIAN_LIST.map((option)=>(
                                        <div className={meridian?.value && meridian.index===option.index? "tp_option tp_option_selected":"tp_option"} key={`merd-option-${option.value}`} tabIndex={0} data-target-index={option.index} onKeyDown={e=>merdKeyDownHandler(e, option)} onClick={e=>setOptionValue(e, "a", option)}>{option.label}</div>
                                    ))
                                }
                            </div>
                        </div>
                            )
                        }
                    </div>
                    <div className="tp_bottomBarWrapper">
                        <div className="tp_bottomBar"></div>
                    </div>
                    <div className="tp_actionsContainer">
                        <button className="tp_confirmBtn" onClick={handleButtonClick}>
                            OK
                        </button>
                    </div>
                </div>
            </div>
            {
                showDropdown && allowBackdrop ?
                    <div className="tp_backdropOverlay" onClick={handleClockIconClick}></div>
                    :
                    null
            }
        </div>
    )
}

export default TimePicker;