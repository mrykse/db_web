import React, { useState, useEffect } from 'react';
import './App.css';

interface Attribute {
    name: string;
    type: string;
}

interface Table {
    name: string;
    attributes: Attribute[];
}

interface DatabaseProps {
    title: string;
    tables: Table[];
}

const Database: React.FC<DatabaseProps> = ({ title, tables }) => {
    const [selectedTable, setSelectedTable] = useState('');

    const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTable(event.target.value);
    };

    return (
        <div className="database">
            <h2>{title}</h2>
            <div className="table-list">
                <label>Tables :</label>
                <select value={selectedTable} onChange={handleTableChange}>
                    <option value="">Toutes les tables</option>
                    {tables.map((table: Table) => (
                        <option key={table.name} value={table.name}>
                            {table.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="tables">
                {tables.map((table: Table, index: number) => (
                    <React.Fragment key={table.name}>
                        {selectedTable && selectedTable !== table.name ? null : (
                            <>
                                {index > 0 && <br />}
                                <h2>{table.name}</h2>
                                <table className="table table-striped">
                                    <thead>
                                    <tr>
                                        <th>Attribut</th>
                                        <th>Type</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {table.attributes.map((attribute: Attribute) => (
                                        <tr key={attribute.name}>
                                            <td>{attribute.name}</td>
                                            <td>{attribute.type}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showTableList, setShowTableList] = useState(false);
    const [databases, setDatabases] = useState<any[]>([
        { title: 'Base de données 1', tables: [] },
        { title: 'Base de données 2', tables: [] },
        { title: 'Base de données 3', tables: [] },
    ]);

    const handleMouseEnter = () => {
        setShowTableList(true);
    };

    const handleMouseLeave = () => {
        setShowTableList(false);
    };

    useEffect(() => {
        fetch('http://localhost:3001/api/tables')
            .then(response => response.json())
            .then(data => {
                const updatedDatabases = [...databases];
                updatedDatabases[0].tables = data.tables.map((table: any) => ({
                    name: table.name,
                    attributes: table.attributes,
                }));
                setDatabases(updatedDatabases);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des tables :', error);
            });
    }, []);

    return (
        <div className="container">
            <h1>Accès aux bases de données</h1>
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        {databases.map((database, index) => (
                            <button
                                key={index}
                                className={`list-group-item list-group-item-action ${index === activeTab ? 'active' : ''}`}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setActiveTab(index)}
                            >
                                {database.title}
                                {showTableList && index === activeTab && (
                                    <div className="table-list">
                                        <span>Tables :</span>
                                        {database.tables.map((table: Table) => (
                                            <span key={table.name} className="table-name"><br/>
                        {table.name}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-md-9">
                    {databases.length > 0 && (
                        <Database title={databases[activeTab].title} tables={databases[activeTab].tables} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
