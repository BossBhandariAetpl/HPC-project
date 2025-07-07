import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PiPowerDuotone } from "react-icons/pi";
import { LuPowerOff } from "react-icons/lu";
import { MdOutlineRestartAlt } from "react-icons/md";

const SlurmcontrollerScreen = ({ title, apiBase }) => {
    const [status, setStatus] = useState(''); // To store the service status
    const [nodes, setNodes] = useState([]);

    // Fetch the current status
    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${apiBase}/getstatus`, { withCredentials: true }); // Dynamic API endpoint
            setStatus(response.data.status);
        } catch (error) {
            console.error('Error fetching status:', error);
            setStatus('Error fetching status');
        }
    };

    // Start, stop, or restart the service
    const handleAction = async (action) => {
        try {
            await axios.post(`${apiBase}/postaction/${action}`, { withCredentials: true }); // Dynamic API endpoint
            fetchStatus(); // Update status after action
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    // const 00= async () => {
    //     try {
    //         const response = await axios.get("http://localhost:8000/api/scheduler/getnodesinfo"); // Replace with your API endpoint
    //         setNodes(response.data?.nodes || []);
    //     } catch (err) {
    //         console.error('Error fetching nodes:', err);
    //     }
    // };

    const fetchNodeList = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:8000/api/scheduler/getnodesinfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, { withCredentials: true });
        setNodes(response.data?.nodes || []);
    } catch (err) {
        console.error('Error fetching nodes:', err);
    }
};

    const handleNodeAction = async (node, action) => {
        try {
            await axios.post(`${apiBase}/postaction/${node}/${action}`, { withCredentials: true }); // Dynamic endpoint for nodes
            fetchNodeList(); // Refresh node data
        } catch (err) {
            console.error(`Error performing ${action} on ${node}:`, err);
        }
    };

    useEffect(() => {
        fetchNodeList();
        fetchStatus();
    }, []);

    return (
        <div>
            {(title === "Slurm Controller" || title === "Slurm Database") && (
                <div className="p-6 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <div className="bg-white p-4 rounded shadow-md">
                        <p className="mb-4 text-lg">
                            <strong>Status:</strong> {status || 'Fetching...'}
                        </p>
                        <div className="flex space-x-6 items-center">
                            {status === 'Running' ? (
                                <button
                                    onClick={() => handleAction('stop')}
                                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 shadow-md focus:outline-none flex justify-center items-center"
                                    title={`Stop ${title}`}
                                >
                                    <LuPowerOff className="text-white text-2xl" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAction('start')}
                                    className="p-4 rounded-full bg-green-500 hover:bg-green-600 shadow-md focus:outline-none flex justify-center items-center"
                                    title={`Start ${title}`}
                                >
                                    <PiPowerDuotone className="text-white text-2xl" />
                                </button>
                            )}
                            <button
                                onClick={() => handleAction('restart')}
                                className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 shadow-md focus:outline-none flex justify-center items-center"
                                title={`Restart ${title}`}
                            >
                                <MdOutlineRestartAlt className="text-white text-2xl" />
                            </button>
                            <button
                                onClick={fetchStatus}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                            >
                                Refresh Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {title === "Compute Node Agent" && (
                <div className="p-6 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <div className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Compute Nodes</h2>
                        {nodes.length > 0 ? (
                            nodes.map((node, index) => (
                                <div key={index} className="flex justify-between items-center mb-4 border-b pb-2">
                                    <div>
                                        <p><strong>Node:</strong> {node.NODELIST}</p>
                                        <p><strong>Status:</strong> {node.STATE}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleNodeAction(node.NODELIST, 'start')}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                                        >
                                            Start
                                        </button>
                                        <button
                                            onClick={() => handleNodeAction(node.NODELIST, 'stop')}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                                        >
                                            Stop
                                        </button>
                                        <button
                                            onClick={() => handleNodeAction(node.NODELIST, 'restart')}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                                        >
                                            Restart
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No nodes available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlurmcontrollerScreen;
