import formatDate from "../../../helpers/formatDate";
import './EventCard.css';

const EventCard = ({ eventId, eventName, artists, eventDate, venueName, city, state, eventUrl, imageUrl }) => {
    return (
        <div key={eventId} className='EventCard'>
            <div className='EventCard-event-card'>
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
                    <div className="EventCard-event-name">{eventName}</div>
                    <div className='EventCard-artists'>
                        <h3>
                            <ul>
                                {artists?.map(artist => (
                                    <li key={artist.artistId}>{artist.artistName}</li>
                                ))}
                            </ul>
                        </h3>
                    </div>
                    <ul className='EventCard-event-date'>
                        <li>
                            <img 
                                src="/images/date-icon.svg" 
                                alt="Calendar icon"
                                className="date-icon"
                                width="25" 
                                height="25"
                            />
                            {formatDate(eventDate)}
                        </li>
                    </ul>
                    <ul className='EventCard-event-venue'>
                        <li>{venueName || 'Venue TBD'}</li>
                        <li>{`${city}, ${state}` || 'Venue TBD'}</li>
                    </ul>
                    <a className='EventCard-event-url' href={eventUrl}>
                        Ticketmaster Link
                    </a>
                </div>
            </div>
        </div>
    )
}

export default EventCard;