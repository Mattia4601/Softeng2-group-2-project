const API_URL = 'http://localhost:3001';

// Service-related API calls
export const fetchServices = async () => {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) {
        throw new Error('Failed to fetch services');
    }
    return response.json();
};

// Counter-related API calls
export const fetchCounters = async () => {
    const response = await fetch(`${API_URL}/counters`);
    if (!response.ok) {
        throw new Error('Failed to fetch counters');
    }
    return response.json();
};

// Ticket-related API calls
export const getTicketForService = async (serviceId) => {
    const response = await fetch(`${API_URL}/ticket?serviceId=${serviceId}`);
    if (!response.ok) {
        throw new Error('Failed to get ticket');
    }
    return response.json();
};

export const closeTicket = async (ticketId) => {
    const response = await fetch(`${API_URL}/ticket/${ticketId}/close`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to close ticket');
    }
    return response.json();
};

export const cancelTicket = async (ticketId) => {
    const response = await fetch(`${API_URL}/ticket/${ticketId}/cancel`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to close ticket');
    }
    return response.json();
};

export const callNextTicket = async (counterId) => {
    const response = await fetch(`${API_URL}/counters/${counterId}/next-ticket`, {
        method: 'POST',
    });

    // 204 = no waiting customers
    if (response.status === 204) return null;

    if (!response.ok) throw new Error('Failed to call next ticket');
    return await response.json();
};
