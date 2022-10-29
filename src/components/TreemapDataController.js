import Treemap from "./Treemap";

function TreemapDataController({tree, screenSize, options, selectedOption, token, setSelectedOptionHandler, setSelectedOfficeHandler}) {
    console.log('Options');
    console.log(options);
    return (
        <div>
            { tree != null ?
              <div id="treemap-box">
                    <select className="form-select my-2" value={selectedOption} onChange={e => setSelectedOptionHandler(e.target.value)}>
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <Treemap width={screenSize[0]} height={screenSize[1]} data={tree} token={token} selectedOption={selectedOption}
                        setSelectedOfficeHandler={setSelectedOfficeHandler} />
              </div>
              : <h1>Завантаження даних...</h1>}
        </div>
    )
}

export default TreemapDataController;