import styled from "styled-components";

const Popup = styled.div` 
    border: 1px lightgray solid;
    border-radius: 5px;
    padding: 2vw 2vh;
    position: absolute;
    width: 8vw;
    background-color: white;
    left: ${props => props.mousePosition[0]}px;
    top: ${props => props.mousePosition[1]}px;
    text-align: left;
`;

function OfficePopup({ mousePosition, officeNumber, cntslots, avgm, minm, maxm}) {
    return (
        <Popup mousePosition={mousePosition}>
            №{officeNumber}<br />
            cntslots <span class="right">{cntslots}</span><br />
            avgm <span class="right">{avgm}</span><br />
            minm <span class="right">{minm}</span><br />
            maxm <span class="right">{maxm}</span><br />
        </Popup>
    )
}

export default OfficePopup;