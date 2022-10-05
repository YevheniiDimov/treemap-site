import styled from "styled-components";

const Popup = styled.div` 
    border: 1px white solid;
    border-radius: 5px;
    padding: 2vw 2vh;
    position: absolute;
    width: 8vw;
    background-color: white;
    left: ${props => props.mousePosition[0]}px;
    top: ${props => props.mousePosition[1]}px;
`;

function OfficePopup({ mousePosition, officeNumber, cntslots, avgm, minm, maxm}) {
    return (
        <Popup mousePosition={mousePosition}>
            №{officeNumber}<br />
            cntslots {cntslots}<br />
            avgm {avgm}<br />
            minm {minm}<br />
            maxm {maxm}<br />
        </Popup>
    )
}

export default OfficePopup;