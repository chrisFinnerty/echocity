import formatDate from "../../../helpers/formatDate";
import './EventCard.css';

const EventCard = ({ eventId, eventName, artists, eventDate, venueName, city, state, eventUrl, imageUrl }) => {
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
                        <div className="EventCard-event-name">{eventName}</div>
                        <div className='EventCard-artists'>
                                {artists?.map(artist => artist.artistName).join(", ")}
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
                            <span>{venueName || 'Venue TBD'}</span>
                            <span>{`${city}, ${state}` || 'Venue TBD'}</span>
                        </div>
                    </div>
                    <a className='EventCard-event-url' href={eventUrl}>
                        Ticketmaster Link
                    </a>
                </div>
            </div>
        </div>
    )
}

export default EventCard;