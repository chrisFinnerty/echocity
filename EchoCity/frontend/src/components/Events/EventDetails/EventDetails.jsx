import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Context from "../../Context";
import EventCard from "../EventCard/EventCard";
import TicketMasterAPI from "../../../api/ticketmasterAPI";
import FavoritesAPI from "../../../api/FavoritesAPI";
import UserEventsAPI from "../../../api/UserEventsAPI";
import './EventDetails.css';

const EventPage = ({ getDomainName }) => {
    const [event, setEvent] = useState(null);
    const [favoriteArtists, setFavoriteArtists] = useState(null);
    const [userEvent, setUserEvent] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useContext(Context);
    const { id } = useParams();

    document.title = "Echocity | Concert Details";
    console.log(userEvent);

    useEffect(() => {
        const getData = async () => {
            try{
                setIsLoading(true);
                const [eventData, favoriteArtists, userEventData ] = await Promise.all([
                    TicketMasterAPI.getEventDetails(id),
                    FavoritesAPI.getAllFavoriteArtists(currentUser.id),
                    UserEventsAPI.getUserEvent(currentUser.id, id)
                ]);

                setEvent(eventData);
                setFavoriteArtists(favoriteArtists);
                setUserEvent(userEventData);
                setError(null);
            } catch(err){
                setError(err.message);
                setEvent(null);
                setFavoriteArtists([]);
                setUserEvent(null);
                console.error("Error fetching event details or favorite artists", err);
            } finally {
                setIsLoading(false);
            }
        }
    
        getData();
    }, [ currentUser, id ]);

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
            console.log("BEFORE INTERESTED TOGGLE", userEvent);
    
          if(userEvent) {
            const updatedRecord = await UserEventsAPI.updateUserEvent(
              currentUser.id,
              eventId,
              !userEvent.isInterested,
              userEvent.isAttended
            );

            
            setUserEvent(updatedRecord);
            console.log("AFTER INTERESTED TOGGLE", updatedRecord);
          } else {
            const newRecord = await UserEventsAPI.createUserEvent(
              currentUser.id,
              eventId,
              true,
              false
            );
    
            setUserEvent(newRecord);
          }
        } catch (err) {
          console.error("Toggle Interested failed:", err);
        }
      };
      
      const toggleAttendedEvent = async (eventId) => {
        try {
    
          if(userEvent) {
            const updatedRecord = await UserEventsAPI.updateUserEvent(
              currentUser.id,
              eventId,
              userEvent.isInterested,
              !userEvent.isAttended
            );

            setUserEvent(updatedRecord);
          } else {
            const newRecord = await UserEventsAPI.createUserEvent(
              currentUser.id,
              eventId,
              false,
              true
            );
    
            setUserEvent(newRecord);
          }
        } catch (err) {
          console.error("Toggle Attended failed:", err);
        }
      };

    if(isLoading) return <div>Loading...</div>

    if(error) return <div className='error'>Error: {error}</div>;

    return (
        <div className="EventPage">
            <h2>{event.eventName}</h2>
            <div className="EventPage-event-container">
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
                    userEvents={userEvent}
                    toggleInterestedEvent={toggleInterestedEvent}
                    toggleAttendedEvent={toggleAttendedEvent}
                    getDomainName={getDomainName}
                />
            </div>
            <div className="EventPage-venue-artists">
                <div className="EventPage-venue">
                    <h3>Venue</h3>
                    <p>{event.venue.name || 'Venue TBD'}</p>
                    <p>{event.venue.address.line1 || 'Address TBD'}</p>
                    <p>{`${event.venue.city.name}, ${event.venue.state.stateCode}` || 'Venue TBD'}</p>
                </div>
            <h3>Artists</h3>
            <div className="EventPage-artists-container">
                <div className="EventPage-artists-row">
                    {event.artists?.map(a => (
                        <div className="EventPage-artist" key={a.artistId}>
                            <div className="EventCard-img-header-container">
                                <img 
                                    className="EventCard-event-image" 
                                    src={`${a.imageUrl}`} 
                                    alt={`${a.artistName}'s Profile Picture`} 
                                />
                            </div>
                                <span key={a.artistName}>
                                    <Link className="EventPage-artist-link" to={`/artists/${a.artistId}`} title={a.artistName}>
                                        {a.artistName}
                                    </Link>
                                </span>
                         </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventPage;