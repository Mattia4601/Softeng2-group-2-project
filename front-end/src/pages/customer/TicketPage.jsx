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
                    ws.current = new WebSocket('ws://localhost:3000');
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

    const handleClose = async () => {
        if (window.confirm('Are you sure you want to close this ticket?')) {
            try {
                const response = await fetch(`http://localhost:3001/ticket/${ticketData.ticket_id}/close`, {
                    method: 'POST',
                });
                
                if (response.ok) {
                    navigate('/services');
                } else {
                    console.error('Failed to close ticket');
                }
            } catch (error) {
                console.error('Error closing ticket:', error);
            }
        }
    };

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

                    <div className="mt-8">
                        <button
                            onClick={handleClose}
                            className="w-full bg-red-600 text-white rounded-md py-3 px-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Close Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketPage;