import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TicketPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ticketData, setTicketData] = useState(location.state?.ticketData);
    const [isCalled, setIsCalled] = useState(false);
    const [counterNumber, setCounterNumber] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        // Redirect if no ticket data
        if (!ticketData) {
            navigate('/services');
            return;
        }

        // Connect to WebSocket
        ws.current = new WebSocket('ws://localhost:3001');

        ws.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        ws.current.onmessage = (event) => {
            // Handle the raw message from the server
            const message = event.data;
            console.log('Received message:', message);
            
            // The backend sends a confirmation message on connection
            if (message === '✅ Connection established via WebSocket') {
                return;
            }

            // Check if the message contains information about our ticket
            if (message.includes(ticketData.ticket_id)) {
                // Extract counter number if present in the message
                const counterMatch = message.match(/counter\s*(\d+)/i);
                if (counterMatch) {
                    setCounterNumber(counterMatch[1]);
                }
                setIsCalled(true);
                // Play sound notification
                const audio = new Audio('/notification.mp3');
                audio.play();
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
            // Attempt to reconnect after a delay
            setTimeout(() => {
                if (ticketData && !isCalled) {
                    console.log('Attempting to reconnect...');
                    ws.current = new WebSocket('ws://localhost:3001');
                }
            }, 5000);
        };

        // Cleanup on component unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [ticketData, navigate, isCalled]);

    // No close ticket functionality needed

    if (!ticketData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Ticket</h2>
                    
                    <div className="mb-8">
                        <div className="text-5xl font-bold text-indigo-600 mb-2">
                            {ticketData.ticket_code}
                        </div>
                        <p className="text-gray-600">Service: {ticketData.service_name}</p>
                    </div>

                    {isCalled ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold">It's your turn! </strong>
                            <span className="block sm:inline">Please proceed to Counter {counterNumber}</span>
                        </div>
                    ) : (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">Please wait for your number to be called</span>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/services')}
                        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Return to Services
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketPage;