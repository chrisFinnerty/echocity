import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../../Context';
import EventCard from '../../Events/EventCard/EventCard';
import Loader from '../../Loader/Loader';
import TicketMasterAPI from '../../../api/ticketmasterAPI';
import FavoritesAPI from '../../../api/FavoritesAPI';
import UserEventsAPI from '../../../api/UserEventsAPI';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ArtistPage.css';

const ArtistPage = ({ getDomainName }) => {
    const { currentUser } = useContext(Context)
    const [artist, setArtist] = useState(null);
    const [artistEvents, setArtistEvents] = useState([]);
    const [favoriteArtist, setFavoriteArtist] = useState(false);
    const [userEvents, setUserEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const getData = async () => {
          if(!currentUser) return;
            try{
                setIsLoading(true);
                const [artistData, artistEventsData, favoriteArtistData, userEventsData] = await Promise.all([
                    TicketMasterAPI.getArtist(id),
                    TicketMasterAPI.getEventsByArtistId(id),
                    FavoritesAPI.getFavoriteArtist(currentUser.id, id),
                    UserEventsAPI.getAllUserEvents(currentUser.id)
                ]);
    
                setArtist(artistData);
                setArtistEvents(artistEventsData);
                setFavoriteArtist(favoriteArtistData);
                setUserEvents(userEventsData);
            } catch(err){
                setError(err);
                console.error("Error fetching data:", err);
            } finally{
                setIsLoading(false);
            }
        }
        
        getData();
    }, [ id, currentUser ]);

    if(artist){
      document.title = artist.name || 'Echocity';
    };

    const groupedEvents = artistEvents.reduce((groups, event) => {
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

    const toggleFavoriteArtist = async () => {
        if(!favoriteArtist){
            await FavoritesAPI.addFavoriteArtist(currentUser.id, id);
            setFavoriteArtist(true);
        } else {
            await FavoritesAPI.deleteFavoriteArtist(currentUser.id, id);
            setFavoriteArtist(false);
        }
    };

    const toggleInterestedEvent = async (eventId) => {
        try {
          const existingRecord = userEvents.find(e => e.eventId === eventId);
    
          if(existingRecord) {
            const updatedRecord = await UserEventsAPI.updateUserEvent(
              currentUser.id,
              eventId,
              !existingRecord.isInterested,
              existingRecord.isAttended
            );
    
            setUserEvents(prev =>
              prev.map(e => e.eventId === eventId ? updatedRecord : e)
            );
          } else {
            const newRecord = await UserEventsAPI.createUserEvent(
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
            const updatedRecord = await UserEventsAPI.updateUserEvent(
              currentUser.id,
              eventId,
              existingRecord.isInterested,
              !existingRecord.isAttended
            );
    
            setUserEvents(prev =>
              prev.map(e => e.eventId === eventId ? updatedRecord : e)
            );
          } else {
            const newRecord = await UserEventsAPI.createUserEvent(
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
    

    if(isLoading || !artist) return <Loader />;

    if(error) return <div className='error'>Error: {error}</div>;

    return (
        <div className='ArtistPage'>
            <div className='ArtistPage-header'>
                <div className='ArtistPage-img-container'>
                    <img className='ArtistPage-artist-image' src={artist.imageUrl} alt={`${artist.name}'s Profile Picture`} />
                    <div className='ArtistPage-favorite'>
                        {favoriteArtist ? <span>Favorited!</span> : <span>Add to Favorites</span>}
                        <button onClick={toggleFavoriteArtist} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {favoriteArtist ? <FaHeart color='red' /> : <FaRegHeart color='red' /> }
                        </button>
                    </div>
                </div>
                <div className='ArtistPage-name'>
                    <h2>{artist.name}</h2>
                </div>
                <div className='ArtistPage-details'>
                    <p>Genres: {artist.genre.map(genre => genre)}</p>
                    <p>Subgenres: {artist.subgenre.map(subgenre => subgenre)}</p>
                    <p><a href={artist.url}>Ticketmaster Profile</a></p>
                </div>
            </div>

            <div className='ArtistPage-events-container'>
            {sortedDates.map(date => (
                <div key={date} className='ArtistPage-date-group'>
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
                            favoriteArtists={favoriteArtist}
                            getDomainName={getDomainName}
                            toggleFavoriteArtist={toggleFavoriteArtist}
                            userEvents={userEvents}
                            toggleInterestedEvent={toggleInterestedEvent}
                            toggleAttendedEvent={toggleAttendedEvent}
                        />
                ))}
            </div>
            ))}
        </div>
    </div>
    )
};

export default ArtistPage;