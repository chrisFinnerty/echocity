import BaseAPI from "./BaseAPI";


class UserEventsAPI extends BaseAPI{

    static async createUserEvent(userId, eventId, isInterested, isAttended){
        try{
            console.log(userId, eventId);
            console.log(typeof userId, typeof eventId);
            const res = await this.request({ endpoint: `api/userEvents`, data: { userId, eventId, isInterested, isAttended }, method: 'post' });
            return res.data;
        } catch(err){
            console.error("Error creatomg the user's event:", err);
        }
    }

    static async updateUserEvent(userId, eventId, isInterested, isAttended){
        try{
            const res = await this.request({ endpoint: `api/userEvents/${userId}/${eventId}`, data: { isInterested, isAttended }, method: 'patch' })
            return res.data;
        } catch(err){
            console.error("Error updating the user's event", err);
        }
    }

    static async getAllUserEvents(userId){
        try{
            const res = await this.request({ endpoint: `api/userEvents/${userId}` });

            return res.data;
        } catch(err){
            console.error("Error getting all user events:", err)
        }
    }

    static async getUserEvent(userId, eventId){
        try{
            const res = await this.request({ endpoint: `api/userEvents/${userId}/${eventId}` });
            return res.data;
        } catch(err){
            console.error("Error getting user event:", err)
        }
    }
}

export default UserEventsAPI;