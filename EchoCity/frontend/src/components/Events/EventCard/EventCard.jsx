import { formatDate } from '../../../../helpers/formatDate';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './EventCard.css';

const EventCard = ({ eventId, eventName, artists, favoriteArtists, toggleFavoriteArtist, eventDate, venueName, city, state, eventUrl, imageUrl, getDomainName }) => {
    let ticketSource = getDomainName(eventUrl);
    
    if(ticketSource === 'Concerts'){
        ticketSource = 'Live Nation'
    } else if(ticketSource === 'Wl'){
        ticketSource = 'See Tickets'
    };

    return (
        <div key={eventId} className='EventCard'>
            <div className='EventCard-card'>
                <div className="EventCard-img-header-container">
                    <div className="EventCard-img-container">
                        {imageUrl && (
                            <img 
                                src={imageUrl} 
                                alt={`Event image for ${eventName}`}
                                className="EventCard-event-image"
                                loading="lazy" 
                            />
                        )}
                    </div>
                    <div className="EventCard-details">
                        <div className="EventCard-event-name"><Link to={`/events/${eventId}`}>{eventName}</Link></div>
                        <div className='EventCard-artists'>
                                {artists?.map(artist => (
                                    <span key={artist.artistName}>
                                        <Link to={`/artists/${artist.artistId}`}>
                                            {artist.artistName}
                                        </Link>
                                        <button onClick={() => toggleFavoriteArtist(artist.artistId)}>
                                            {favoriteArtists.some(a => a.artistId === artist.artistId) ? <FaHeart color='red' /> : <FaRegHeart color='red' /> }
                                        </button>
                                    </span>
                                ))}
                        </div>
                        <div className='EventCard-event-date'>
                            <img 
                                src="/images/date-icon.svg" 
                                alt="Calendar icon"
                                className="date-icon"
                                width="25" 
                                height="25"
                            />
                            <span>{formatDate(eventDate)}</span>
                        </div>
                        <div className='EventCard-event-venue'>
                            <span>{venueName || 'Venue TBD'} | {`${city}, ${state}` || 'Venue TBD'}</span>
                        </div>
                    </div>
                    <a className='EventCard-event-url' href={eventUrl}>
                        <button>{ticketSource}</button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default EventCard;