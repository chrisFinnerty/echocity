import BaseAPI from './BaseAPI';

class TicketMasterAPI extends BaseAPI {

    // Events from PSQL DB pulled from TM API
    static async getEvents(filters = {}) {
      try {
        const res = await this.request({ 
          endpoint: 'api/events', 
          data: { 
            city: filters.city,
            state: filters.state,
            genre: filters.genre, 
            subgenre: filters.subgenre,
            searchTerm: filters.searchTerm
          } 
        });
        
        return res.data || [];
        
      } catch (err) {
        console.error("Failed to fetch events:", err);
        return [];
      }
    }
  
    static async getEventDetails(id) {
      try {
        const res = await this.request({ endpoint: `api/events/${id}` });
        return res.data || [];
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        return null;
      }
    }

    static async getEventsByArtistId(id){
      try{
        const res = await this.request({ endpoint: `api/artists/${id}/events` });

        return res.data || [];
      } catch(err){
        console.error("Failed to fetch events for the artist", err);
      }
    }

    // Artists from PSQL DB pulled from TM API
    static async getArtist(id) {
      try{
        const res = await this.request({ endpoint: `api/artists/${id}` });
        return res.data;
      } catch(err){
        console.error("Failed to fetch artist details", err);
        return null;
      }
    }

    static async getMultipleArtists(filters={}) {
      try{
        const res = await this.request({ endpoint: `api/artists`, data: { filters } });
        return res.data;
      } catch(err){
        console.error("Failed to fetch artist details", err);
        return null;
      }
    }
  }

export default TicketMasterAPI;