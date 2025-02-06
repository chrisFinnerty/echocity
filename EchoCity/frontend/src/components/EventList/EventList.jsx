import { useState, useEffect } from 'react';
import TicketMasterAPI from '../../api/ticketmasterAPI';
import EventCard from '../EventCard/EventCard';
import './EventList.css'

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchEvents() {
            try{
                setIsLoading(true);
                const eventsData = await TicketMasterAPI.getEvents({
                    // city: 'los angeles',
                    // genre: 'rock',

                    // add other filters - will probably need to populate
                    // from user search prefs? pass variables in as props?
                });
                const uniqueEvents = eventsData?.reduce((acc, current) => {
                    if(!acc.find(item => item.eventId === current.eventId)) {
                        acc.push(current);
                    }
                    return acc;
                }, [] || []);
                
                setEvents(uniqueEvents || []);
                setError(null);
            }
            catch(err){
                setError(err.message);
                setEvents([]);
                console.error("Failed to fetch events:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents();
    }, []);

    if(isLoading) return <div className='isLoading'>Loading events...</div>;

    if(error) return <div className='error'>Error: {error}</div>;

    return (
        <div className='EventList'>
            <h2>Upcoming Events</h2>
            {events.length === 0 ? (
                <p>No events found.</p>
            ) : (
                <div className='EventList-events-container'> 
                    {events.map(event => (
                        <EventCard 
                            key={event.eventId}
                            eventId={event.eventId} 
                            eventName={event.eventName}
                            artists={event.artists}
                            eventDate={event.eventDate}
                            venueName={event.venueName}
                            city={event.city}    
                            state={event.state}
                            eventUrl={event.url}
                            imageUrl={event.imageUrl}    
                        />
                    ))}
                </div>
            )
        }
        </div>
    )
}

export default EventList;