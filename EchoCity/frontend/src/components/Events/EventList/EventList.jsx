import { useState, useEffect, useContext } from 'react';
import Context from '../../Context';
import TicketMasterAPI from '../../../api/ticketmasterAPI';
import FavoritesAPI from '../../../api/FavoritesAPI';
import EventCard from '../EventCard/EventCard';
import { formatDateHeaders } from '../../../../helpers/formatDate';
import './EventList.css';

const EventList = ({ getDomainName }) => {
    const { currentUser } = useContext(Context);
    const [events, setEvents] = useState([]);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getData() {
            try{
                setIsLoading(true);
                const [ eventsData, favoriteArtists ] = await Promise.all([
                  TicketMasterAPI.getEvents({
                      // city: 'los angeles',
                      // genre: 'rock',
  
                      // add other filters - will probably need to populate
                      // from user search prefs? pass variables in as props?
                  }),
                  FavoritesAPI.getAllFavoriteArtists(currentUser.id)
                ]);
                
                const uniqueEvents = eventsData?.reduce((acc, current) => {
                  if(!acc.find(item => item.eventId === current.eventId)) {
                    acc.push(current);
                  }
                  return acc;
                }, []);
                
                setEvents(uniqueEvents || []);
                setFavoriteArtists(favoriteArtists);
                setError(null);
              }
              catch(err){
                setError(err.message);
                setEvents([]);
                setFavoriteArtists([]);
                console.error("Failed to fetch events or favorites:", err)
            } finally {
                setIsLoading(false)
            }
        }

        getData();
    }, [ currentUser ]);

    if(isLoading) return <div className='isLoading'>Loading events...</div>;

    if(error) return <div className='error'>Error: {error}</div>;

    const groupedEvents = events.reduce((groups, event) => {
        const date = event.eventDate;
        if(!groups[date]){
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedEvents).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    const toggleFavoriteArtist = async (artistId) => {
      try{
        const isFavorite = favoriteArtists.some(a => a.artistId === artistId);
        if(isFavorite){
          await FavoritesAPI.deleteFavoriteArtist(currentUser.id, artistId);
        } else {
          await FavoritesAPI.addFavoriteArtist(currentUser.id, artistId);
        };

        setFavoriteArtists(prev =>
          isFavorite ? prev.filter(a => a.artistId !== artistId)
          : [...prev, { 
              userId: currentUser.id, 
              artistId 
            }]);
      } catch(err){
        console.error("Toggle Favorite Artist failed", err);
      }
  };

    console.log(favoriteArtists);

    return (
        <div className='EventList'>
          <h2>Upcoming Concerts</h2>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className='EventList-events-container'>
              {sortedDates.map(date => (
                <div key={date} className='EventList-date-group'>
                  <h3>{formatDateHeaders(date)}</h3>
                  {groupedEvents[date].map(event => (
                    <EventCard
                      key={event.eventId}
                      eventId={event.eventId}
                      eventName={event.eventName}
                      artists={event.artists}
                      favoriteArtists={favoriteArtists}
                      toggleFavoriteArtist={toggleFavoriteArtist}
                      eventDate={event.eventDate}
                      venueName={event.venueName}
                      city={event.city}
                      state={event.state}
                      eventUrl={event.url}
                      imageUrl={event.imageUrl}
                      getDomainName={getDomainName}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
    );
};

export default EventList;