import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Context from '../../Context';
import ArtistCard from '../ArtistCard/ArtistCard';
import TicketMasterAPI from '../../../api/ticketmasterAPI';
import FavoritesAPI from '../../../api/FavoritesAPI';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ArtistPage.css';

const ArtistPage = ({ getDomainName }) => {
    const { currentUser } = useContext(Context)
    const [artist, setArtist] = useState(null);
    const [artistEvents, setArtistEvents] = useState([]);
    const [favoriteArtist, setFavoriteArtist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const getArtist = async () => {
            try{
                const artistData = await TicketMasterAPI.getArtist(id);

                setArtist(artistData);
                setError(null);
            } catch(err){
                setError(err.message);
                setArtist(null);
                console.error("Error fetching artist details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const getArtistEvents = async () => {
            try{
                const artistEvents = await TicketMasterAPI.getEventsByArtistId(id);

                setArtistEvents(artistEvents);
                setError(null);
            } catch(err){
                console.error("Error fetching artist events:", err)
            } finally {
                setIsLoading(false);
            }
        };

        const getFavoriteArtist = async () => {
            try{
                const favoriteArtist = await FavoritesAPI.getFavoriteArtist(currentUser.id, id);
                setFavoriteArtist(favoriteArtist);
            } catch(err){
                console.error("Error fetching favorite artist status:", err);
            } finally {
                setIsLoading(false);
            }
        }

        getArtist();
        getArtistEvents();
        getFavoriteArtist();
    }, [ id ]);

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

    if(isLoading || !artist) return <div className='isLoading'>Loading events...</div>;

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
                        <ArtistCard
                            key={event.eventId}
                            eventId={event.eventId}
                            eventName={event.eventName}
                            artists={event.artists}
                            eventDate={event.eventDate}
                            venueName={event.venueName}
                            city={event.city}
                            state={event.state}
                            eventUrl={event.url}
                            getDomainName={getDomainName}
                        />
                ))}
            </div>
            ))}
        </div>
    </div>
    )
};

export default ArtistPage;