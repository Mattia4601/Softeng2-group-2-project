import { useState } from 'react';
import {callNextTicket, cancelTicket, closeTicket} from "../services/api.js";

const CounterPage = () => {
    const counterId = localStorage.getItem('counterId');
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCallNext = async () => {
        setLoading(true);
        setError(null);
        try {
            const nextTicket = await callNextTicket(counterId);
            if (!nextTicket) {
                alert('No customers waiting.');
                setTicket(null);
            } else {
                setTicket(nextTicket);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!ticket) return;
        setLoading(true);
        setError(null);
        try {
            await closeTicket(ticket.ticket_id);
            alert(`Ticket ${ticket.ticket_code} closed.`);
            setTicket(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTicket = async () => {
        if (!ticket) return;
        setLoading(true);
        setError(null);
        try {
            await cancelTicket(ticket.ticket_id);
            alert(`Ticket ${ticket.ticket_code} cancelled.`);
            setTicket(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Counter Dashboard</h2>
            <p className="text-gray-700 mb-4">
                Counter ID: <strong>{counterId}</strong>
            </p>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </div>
            )}

            {!ticket ? (
                <button
                    onClick={handleCallNext}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
                >
                    {loading ? 'Loading...' : 'Call Next Customer'}
                </button>
            ) : (
                <div className="flex flex-col items-center">
                    <p className="text-lg mb-4">
                        Serving Ticket: <strong>{ticket.ticket_code}</strong>
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={handleCloseTicket}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
                        >
                            {loading ? 'Closing...' : 'Finish Ticket'}
                        </button>
                        <button
                            onClick={handleCancelTicket}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded disabled:bg-gray-400"
                        >
                            {loading ? 'Cancelling...' : 'Cancel Ticket'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CounterPage;
