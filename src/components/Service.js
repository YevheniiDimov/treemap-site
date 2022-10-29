function Service({office, services}) {
    let total = 0;
    for (let i = 0; i < services.length; i++) {
        total += parseFloat(services[i].kavg);
    }
    const avg = total / services.length;
    const min = Math.min(... services.map(s => s.kavg));
    const max = Math.max(... services.map(s => s.kavg));
    console.log(services.map(s => s.kavg));

    return (
        <div className="container">
            <h2>{office.offices_name}</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Кількість</th>
                        <th>Назва</th>
                        <th>Використання робочого часу</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map(service => (
                        <tr key={service.id_q}>
                            <td>{service.id_q}</td>
                            <td>{service.cnt}</td>
                            <td>{service.qname}</td>
                            <td>{service.kavg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className="table table-sm table-bordered table-hover mt-5">
                <thead>
                    <tr>
                        <th>Використання робочого часу</th>
                        <th>Середнє</th>
                        <th>Мінімальне</th>
                        <th>Максимальне</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>{avg}</td>
                        <td>{min}</td>
                        <td>{max}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Service;