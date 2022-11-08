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
        <div className="container-fluid col-10">
            <h2 className="text-white">{office.offices_name}</h2>
            <table className="table text-white">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Назва послуги</th>
                        <th>Надано</th>
                        <th>Використання робочого часу</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map(service => (
                        <tr key={service.id_q}>
                            <td>{service.id_q}</td>
                            <td>{service.qname}</td>
                            <td>{service.cnt}</td>
                            <td>{Math.round(service.kavg) + '%'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className="table table-sm table-bordered mt-5 text-white">
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
                        <td>{Math.round(avg * 100) / 100 + '%'}</td>
                        <td>{Math.round(min) + '%'}</td>
                        <td>{Math.round(max) + '%'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Service;