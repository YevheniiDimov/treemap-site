import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const Popup = styled.div` 
    border: 1px lightgray solid;
    border-radius: 5px;
    padding: 0 0.5vh;
    position: absolute;
    background-color: white;
    left: ${props => props.mousePosition[0]}px;
    top: ${props => props.mousePosition[1]}px;
    font-size: 14px;
    color: black;
    z-index: 1;
`;

function retrieveValues(data, token, setReceivedCallback, setDataCallback, setMessageCallback) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    let formdata = new FormData();
    formdata.append("office_id", data.id_offices);

    let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
    };

    fetch("https://idmvs.ugis.org.ua/api/dboard/get/statoffice", requestOptions)
		.then(response => response.text())
		.then(async result => {
            let values_list = JSON.parse(eval(result)).rows;
            if (!values_list) {
                throw new Error("Помилка: Додаткові дані офісу наразі недоступні.");
            }

            let values = values_list[0]
            if (!values) {
                throw new Error("Помилка: Запит пройшов успішно, але дані відсутні.");
            }

            for (let attrname in values) {
                data[attrname] = values[attrname];
            }

            console.log("Values +");
            console.log(values);

            setDataCallback(data);
            setReceivedCallback(true);
        })
        .catch(error => {
            console.log('Values Error: ' + error);
            setMessageCallback(error.message);
        });
}

function OfficePopup({ mousePosition, office_data, token, setMessageCallback}) {
    const [position, setPosition] = useState(mousePosition);
    const [data, setData] = useState(office_data);
    const [receivedValues, setReceivedValues] = useState(false);
    const popupRef = useRef();
    
    useEffect(() => {
        if (popupRef.current) {
            let mouseX = mousePosition[0];
            let mouseY = mousePosition[1];

            if (mouseX > window.innerWidth/2) {
                mouseX -= popupRef.current.offsetWidth;
                console.log("Right");
            }
            else {
                console.log("Left");
            }

            if (mouseY > window.innerHeight/2) {
                mouseY -= popupRef.current.offsetHeight;
                console.log("Bottom");
            }
            else {
                console.log("Top");
            }

            setPosition([mouseX, mouseY]);

            if (!receivedValues) {
                retrieveValues(office_data, token, setReceivedValues, setData, setMessageCallback);
            }
        }
    }, [mousePosition, data]);

    retrieveValues(office_data, token, setReceivedValues, setData, setMessageCallback);

    return (
        <div>
            { receivedValues && data.cnt ?
            <Popup mousePosition={position} ref={popupRef} className="d-flex flex-wrap justify-content-between align-items-center" id="popup">
                <table className="table-sm">
                    <thead>
                        <tr>
                            <th scope="col">ТСЦ №</th>
                            <th scope="col">Прийнято</th>
                            <th scope="col">Точність (хв.)</th>
                            <th scope="col">Min (хв.)</th>
                            <th scope="col">Max (хв.)</th>
                            <th scope="col">Талонів</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td>{data.offices_n}</td>
                            <td>{data.cntslots}</td>
                            <td>{data.value}</td>
                            <td>{data.minm}</td>
                            <td>{data.maxm}</td>
                            <td>{data.cnt}</td>
                        </tr>
                        <tr className="text-center">
                            <th scope="col">Вільні</th>
                            <th scope="col">Резерв</th>
                            <th scope="col">Жорсткий резерв</th>
                            <th scope="col">Зареєстровано</th>
                            <th scope="col">Йде прийом</th>
                            <th scope="col">Завершено</th>
                        </tr>
                        <tr className="text-center">
                            <td>{data.freetoprocessing}</td>
                            <td>{data.reserve}</td>
                            <td>{data.hardreserve}</td>
                            <td>{data.waiting}</td>
                            <td>{data.processing}</td>
                            <td>{data.processed}</td>
                        </tr>
                    </tbody>
                </table>
            </Popup>
            : <div>Отримання додаткових даних...</div>
            }
        </div>
    )
}

export default OfficePopup;