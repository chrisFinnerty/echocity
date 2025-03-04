import { formatDate } from '../../../../helpers/formatDate';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaToggleOff, FaToggleOn, FaCalendarCheck, FaRegCalendarTimes } from 'react-icons/fa';
import './EventCard.css';

const EventCard = ({ eventId, eventName, artists, eventDate, venueName, city, state, eventUrl, imageUrl, getDomainName, favoriteArtists, toggleFavoriteArtist, userEvents, toggleInterestedEvent, toggleAttendedEvent }) => {

    const isArtistFavorite = (artistId) => {
        return Array.isArray(favoriteArtists)
            ? favoriteArtists.some(a => a.artistId === artistId)
            : favoriteArtists && favoriteArtists.artistId === artistId;
    };

    const isInterested = Array.isArray(userEvents)
        ? userEvents.some(e => e.eventId === eventId && e.isInterested)
        : userEvents && userEvents.isInterested;
        
    const isAttended = Array.isArray(userEvents)
        ? userEvents.some(e => e.eventId === eventId && e.isAttended)
        : userEvents && userEvents.isAttended;

    const disableActions = isAttended;
        
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
                        <Link to={`/concerts/${eventId}`}>
                            {imageUrl && (
                                <img 
                                src={imageUrl} 
                                alt={`Event image for ${eventName}`}
                                className="EventCard-event-image"
                                loading="lazy" 
                                />
                            )}
                        </Link>
                    </div>
                    <div className="EventCard-details">
                        <div className="EventCard-event-name"><Link to={`/concerts/${eventId}`}>{eventName}</Link></div>
                        <div className='EventCard-artists'>
                                {artists?.map(artist => (
                                    <span key={artist.artistName}>
                                        <Link to={`/artists/${artist.artistId}`}>
                                            {artist.artistName}
                                        </Link>
                                        <button onClick={() => toggleFavoriteArtist(artist.artistId)}>
                                            {isArtistFavorite(artist.artistId) ? <FaHeart color='red' /> : <FaRegHeart color='red' /> }
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
                    <div className='EventCard-event-buttons-container'>
                        <div className='EventCard-userEvents-button'>
                                <button onClick={() => toggleInterestedEvent(eventId)} disabled={disableActions}>
                                    {isInterested ? <FaToggleOn color='yellow '/> : <FaToggleOff color='yellow '/>}<span>Interested</span> 
                                </button>
                                {new Date(eventDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) && 
                                    <button onClick={() => toggleAttendedEvent(eventId)} disabled={disableActions}>
                                        {isAttended ? <FaCalendarCheck color='green' /> : <FaRegCalendarTimes color='red'/>} <span>Attended</span>
                                    </button>     
                                }
                                <a className='EventCard-event-url' href={eventUrl} target='_blank' rel='noopener noreferrer'>
                                    <button>{ticketSource}</button>
                                </a>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    )
}

export default EventCard;