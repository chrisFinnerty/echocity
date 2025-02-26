import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Context from '../../Context';
import TicketMasterAPI from '../../../api/ticketmasterAPI';
import FavoritesAPI from '../../../api/FavoritesAPI';
import UserEventsAPI from '../../../api/UserEventsAPI';
import EventCard from '../EventCard/EventCard';
import { formatDateHeaders } from '../../../../helpers/formatDate';
import './EventList.css';

const EventList = ({ getDomainName }) => {
    const { currentUser } = useContext(Context);
    const [events, setEvents] = useState([]);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [userEvents, setuserEvents] = useState([]);
    const [cityFilter, setCityFilter] = useState('');
    const [stateFilter, setStateFilter] = useState(currentUser?.state || '');
    const [cityOptions, setCityOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 40;

    document.title = `Echocity | Discover`;

    async function getData() {
        try{
            setIsLoading(true);
            const [ eventsData, favoriteArtists, userEvents ] = await Promise.all([
              TicketMasterAPI.getEvents({
                  city: cityFilter || null,
                  state: stateFilter || null,
                  searchTerm: searchTerm || null
              }),
              FavoritesAPI.getAllFavoriteArtists(currentUser.id),
              UserEventsAPI.getAllUserEvents(currentUser.id)
            ]);
            
            const uniqueEvents = eventsData?.reduce((acc, current) => {
              if(!acc.find(item => item.eventId === current.eventId)) {
                acc.push(current);
              }
              return acc;
            }, []);

            const uniqueCities = [...new Set(eventsData.map(event => event.city))];
            const uniqueStates = [...new Set(eventsData.map(event => event.state))];

            setCityOptions(uniqueCities);
            setStateOptions(uniqueStates);
            
            setEvents(uniqueEvents || []);
            setFavoriteArtists(favoriteArtists);
            setuserEvents(userEvents);
            setError(null);
          }
          catch(err){
            setError(err.message);
            setEvents([]);
            setFavoriteArtists([]);
            setuserEvents([]);
            console.error("Failed to fetch events or favorites:", err)
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
      if(currentUser){
        getData();
      }
    }, [ currentUser, cityFilter, stateFilter ]);
    

    if(isLoading) return <div className='isLoading'>Loading events...</div>;
    if(error) return <div className='error'>Error: {error}</div>;

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const groupedEvents = currentEvents.reduce((groups, event) => {
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

    const totalPages = Math.ceil(events.length / eventsPerPage);
    const handlePrev = () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    };
  
    const handleNext = () => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

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

  const toggleInterestedEvent = async (eventId) => {
    try {
      const existingRecord = userEvents.find(e => e.eventId === eventId);
      console.log(existingRecord);

      if(existingRecord) {
        const updatedRecord = await UserEventsAPI.updateUserEvent(
          currentUser.id,
          eventId,
          !existingRecord.isInterested,
          existingRecord.isAttended
        );

        setuserEvents(prev =>
          prev.map(e => e.eventId === eventId ? updatedRecord : e)
        );
      } else {
        const newRecord = await UserEventsAPI.createUserEvent(
          currentUser.id,
          eventId,
          true,
          false
        );

        setuserEvents(prev => [...prev, newRecord]);
      }
    } catch (err) {
      console.error("Toggle Interested failed:", err);
    }
  };
  
  const toggleAttendedEvent = async (eventId) => {
    try {
      const existingRecord = userEvents.find(e => e.eventId === eventId);

      if(existingRecord) {
        const updatedRecord = await UserEventsAPI.updateUserEvent(
          currentUser.id,
          eventId,
          existingRecord.isInterested,
          !existingRecord.isAttended
        );

        setuserEvents(prev =>
          prev.map(e => e.eventId === eventId ? updatedRecord : e)
        );
      } else {
        const newRecord = await UserEventsAPI.createUserEvent(
          currentUser.id,
          eventId,
          false,
          true
        );

        setuserEvents(prev => [...prev, newRecord]);
      }
    } catch (err) {
      console.error("Toggle Attended failed:", err);
    }
  };

    return (
        <div className='EventList' data-testid="events-container">
          <h2>Upcoming Concerts</h2>
          <div className='filters'>
              <input
                type="text"
                placeholder="Search by artist, venue, event, or location..."
                value={searchTerm}
                className='filters-search-input'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => getData()}>Search</button>
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                  <option value=''>All Cities</option>
                  {cityOptions.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
                <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                  <option value=''>All States</option>
                  {stateOptions.map((state, idx) => (
                    <option key={idx} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className='pagination-controls'>
                <Link onClick={handlePrev} disabled={currentPage === 1}>
                  Prev
                </Link>
                <span>Page {currentPage} of {totalPages}</span>
                <Link onClick={handleNext} disabled={currentPage === totalPages}>
                  Next
                </Link>
              </div>
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
                      eventDate={event.eventDate}
                      venueName={event.venueName}
                      city={event.city}
                      state={event.state}
                      eventUrl={event.url}
                      imageUrl={event.imageUrl}
                      favoriteArtists={favoriteArtists}
                      toggleFavoriteArtist={toggleFavoriteArtist}
                      userEvents={userEvents}
                      toggleInterestedEvent={toggleInterestedEvent}
                      toggleAttendedEvent={toggleAttendedEvent}
                      getDomainName={getDomainName}
                    />
                  ))}
                </div>
              ))}
              <div className='pagination-controls'>
                <Link onClick={handlePrev} disabled={currentPage === 1}>
                  Prev
                </Link>
                <span>Page {currentPage} of {totalPages}</span>
                <Link onClick={handleNext} disabled={currentPage === totalPages}>
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
    );
};

export default EventList;