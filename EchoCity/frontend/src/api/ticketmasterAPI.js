import axios from 'axios';

class TicketMasterAPI {
    static async getEvents(filters = {}) {
      try {
        console.log("RUNNING getEvents");
        const res = await axios.get('/api/events', { 
          params: {
            // Map frontend filters to database fields
            city: filters.city,
            genre: filters.genre,
            subgenre: filters.subgenre,
          }
        });

        console.log(res.data.rows);
        
        // Transform to match existing frontend structure
        return res.data?.rows || [];
        
      } catch (err) {
        console.error("Failed to fetch events:", err);
        return [];
      }
    }
  
    static async getEventDetails(eventId) {
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        return {
          ...res.data,
          // Add any additional transformations here
        };
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        return null;
      }
    }
  }

export default TicketMasterAPI;