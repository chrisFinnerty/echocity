
import { useState, useContext, useEffect } from "react"; 
import Context from "../../Context.jsx";
import EventCard from "../../Events/EventCard/EventCard.jsx";
import UserEvents from "../../../api/UserEventsAPI.js";
import FavoritesAPI from "../../../api/FavoritesAPI.js";
import Loader from '../../Loader/Loader.jsx';
import './MyConcerts.css';

const MyConcerts = ({ getDomainName }) => {
    const { currentUser } = useContext(Context);
    const [userEvents, setUserEvents] = useState([]);
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    document.title = "Echocity | My Concerts";

    useEffect(() => {
        const getData = async() => {
          if(!currentUser) return;
            try{
                setIsLoading(true);
                const [ userEventsData, favoriteArtists ] = await Promise.all([
                    UserEvents.getAllUserEvents(currentUser.id),
                    FavoritesAPI.getAllFavoriteArtists(currentUser.id)
                ]);

                setInterestedEvents(userEventsData.filter(e => e.isInterested && !e.isAttended));
                setAttendedEvents(userEventsData.filter(e => e.isAttended));
                setUserEvents(userEventsData);
                setFavoriteArtists(favoriteArtists);
            } catch(err){
                setInterestedEvents([]);
                setAttendedEvents([]);
                setFavoriteArtists([]);
                setError(err);
                console.error("Failed to get user events", err);
            } finally {
                setIsLoading(false);
            }
        }

        getData();
    }, [ currentUser ]);

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
            const updatedRecord = await UserEvents.updateUserEvent(
              currentUser.id,
              eventId,
              !existingRecord.isInterested,
              existingRecord.isAttended
            );
    
            setUserEvents(prev =>
              prev.map(e => e.eventId === eventId ? updatedRecord : e)
            );
          } else {
            const newRecord = await UserEvents.createUserEvent(
              currentUser.id,
              eventId,
              true,
              false
            );
    
            setUserEvents(prev => [...prev, newRecord]);
          }
        } catch (err) {
          console.error("Toggle Interested failed:", err);
        }
      };
      
      const toggleAttendedEvent = async (eventId) => {
        try {
          const existingRecord = userEvents.find(e => e.eventId === eventId);
    
          if(existingRecord) {
            const updatedRecord = await UserEvents.updateUserEvent(
              currentUser.id,
              eventId,
              existingRecord.isInterested,
              !existingRecord.isAttended
            );
    
            setUserEvents(prev =>
              prev.map(e => e.eventId === eventId ? updatedRecord : e)
            );
          } else {
            const newRecord = await UserEvents.createUserEvent(
              currentUser.id,
              eventId,
              false,
              true
            );
    
            setUserEvents(prev => [...prev, newRecord]);
          }
        } catch (err) {
          console.error("Toggle Attended failed:", err);
        }
      };
    
    if(isLoading) return <Loader />;

    if(error) return <div className='error'>Error: {error}</div>;

    return (
        <div className="MyConcerts">
            <div className="MyConcerts-container">
                <div className="MyConcerts-section">
                    <div className="MyConcerts-header">
                        <h2>Interested Concerts</h2>
                    </div>
                    <div className="MyConcerts-interested-container">
                        {interestedEvents.length > 0 ? (
                            interestedEvents.map(event => (
                                <EventCard
                                key={event.eventId}
                                eventId={event.eventId}
                                eventName={event.eventName}
                                artists={event.artists}
                                eventDate={event.eventDate}
                                venueName={event.venue.name}
                                city={event.venue.city.name}
                                state={event.venue.state.stateCode}
                                eventUrl={event.url}
                                imageUrl={event.imageUrl}
                                favoriteArtists={favoriteArtists}
                                toggleFavoriteArtist={toggleFavoriteArtist}
                                userEvents={userEvents}
                                toggleInterestedEvent={toggleInterestedEvent}
                                toggleAttendedEvent={toggleAttendedEvent}
                                getDomainName={getDomainName}
                                />
                            ))
                        ) : (
                            <p>No Interested Concerts</p>
                        )}
                    </div>
                </div>
                <div className="MyConcerts-section">
                    <div className="MyConcerts-header">
                        <h2>Attended Concerts</h2>
                    </div>
                    <div className="MyConcerts-attended-container">
                        {attendedEvents.length > 0 ? (
                            attendedEvents.map(event => (
                                <EventCard
                                    key={event.eventId}
                                    eventId={event.eventId}
                                    eventName={event.eventName}
                                    artists={event.artists}
                                    eventDate={event.eventDate}
                                    venueName={event.venue.name}
                                    city={event.venue.city.name}
                                    state={event.venue.state.stateCode}
                                    eventUrl={event.url}
                                    imageUrl={event.imageUrl}
                                    favoriteArtists={favoriteArtists}
                                    toggleFavoriteArtist={toggleFavoriteArtist}
                                    userEvents={userEvents}
                                    toggleInterestedEvent={toggleInterestedEvent}
                                    toggleAttendedEvent={toggleAttendedEvent}
                                    getDomainName={getDomainName}
                                    />
                            ))
                        ) : (
                            <p>No Attended Concerts (yet!)</p>
                        )}
                    </div>
                </div>
        </div>
    </div>
    )
}

export default MyConcerts;