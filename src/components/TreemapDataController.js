import Treemap from "./Treemap";

function TreemapDataController({tree, screenSize, options, selectedOption, token, setSelectedOptionHandler, setSelectedOfficeHandler}) {
    return (
        <div>
            { tree != null ?
              <div id="treemap-box" className="mx-2">
                    <div className="col-4">
                        <select className="form-select my-2" onChange={e => setSelectedOptionHandler(e.target.value)}>
                            <option key={0} value='accuracy'>Точність прийому</option>
                            <option key={1} value='worktime'>Використання робочого часу</option>
                            <optgroup label="Сервіси">
                                {options.map((option, index) => <option key={index + 2} value={option}>{option}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    <Treemap width={screenSize[0]} height={screenSize[1]} data={tree} token={token} selectedOption={selectedOption}
                        setSelectedOfficeHandler={setSelectedOfficeHandler} />
              </div>
              : <h1 className="mx-2">Завантаження даних...</h1>}
        </div>
    )
}

export default TreemapDataController;