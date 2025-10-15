import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices, getTicketForService } from '../../services/api';

const ServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Failed to load services. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    const handleServiceSelect = async (serviceId) => {
        try {
            const ticketData = await getTicketForService(serviceId);
            // Navigate to ticket page with the ticket data
            navigate('/customer/ticket', { state: { ticketData } });
        } catch (err) {
            console.error('Error getting ticket:', err);
            setError('Failed to get ticket. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading services...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Available Services</h1>
                <div className="grid gap-6 md:grid-cols-2">
                    {services.map((service) => (
                        <div
                            key={service.service_id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="text-sm text-gray-500 mb-4">
                                Average wait time: {service.avg_service_time} minutes
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Would you like to get a ticket for ${service.name}?`)) {
                                            handleServiceSelect(service.service_id);
                                        }
                                    }}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Get Ticket
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;