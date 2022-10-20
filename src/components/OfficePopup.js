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
    text-align: left;
`;

function retrieveValues(office_data, token, setReceivedCallback, setMessageCallback) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    let formdata = new FormData();
    formdata.append("office_id", office_data.id_offices);

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
                office_data[attrname] = values[attrname];
            }

            console.log("Values +");
            console.log(values);

            setReceivedCallback(true);
        })
        .catch(error => {
            console.log('Values Error: ' + error);
            setMessageCallback(error.message);
        });
}

function OfficePopup({ mousePosition, office_data, token, setMessageCallback}) {
    const [position, setPosition] = useState(mousePosition);
    const [receivedValues, setReceivedValues] = useState(false);
    const popupRef = useRef();
    
    useEffect(() => {
        if (popupRef.current) {
            if (mousePosition[0] > window.innerWidth/2) {
                setPosition([mousePosition[0] - popupRef.current.offsetWidth, mousePosition[1]]);
                console.log("Right");
            }
            else {
                setPosition(mousePosition);
                console.log("Left");
            }

            if (!receivedValues) {
                retrieveValues(office_data, token, setReceivedValues, setMessageCallback);
            }
        }
    }, [mousePosition]);

    retrieveValues(office_data, token, setReceivedValues, setMessageCallback);

    return (
        <div>
            { receivedValues && office_data.cnt ?
            <Popup mousePosition={position} ref={popupRef} class="d-flex flex-wrap justify-content-between align-items-center" id="popup">
                <table class="table-sm">
                    <thead>
                        <tr>
                            <th scope="col">ТСЦ №</th>
                            <th scope="col">Прийнято</th>
                            <th scope="col">Точність (хв.)</th>
                            <th scope="col">Min (хв.)</th>
                            <th scope="col">Max (хв.)</th>
                            <th scope="col">Cnt</th>
                            <th scope="col">Freetoprocessing</th>
                            <th scope="col">Reserve</th>
                            <th scope="col">Hardreserve</th>
                            <th scope="col">Waiting</th>
                            <th scope="col">Processing</th>
                            <th scope="col">Processed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center">{office_data.officeNumber}</td>
                            <td class="text-center">{office_data.cntslots}</td>
                            <td class="text-center">{office_data.avgm}</td>
                            <td class="text-center">{office_data.minm}</td>
                            <td class="text-center">{office_data.maxm}</td>
                            <td class="text-center">{office_data.cnt}</td>
                            <td class="text-center">{office_data.freetoprocessing}</td>
                            <td class="text-center">{office_data.reserve}</td>
                            <td class="text-center">{office_data.hardreserve}</td>
                            <td class="text-center">{office_data.processing}</td>
                            <td class="text-center">{office_data.processed}</td>
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