import BaseAPI from "./BaseAPI";

class FavoritesAPI extends BaseAPI {
    static async addFavoriteArtist(userId, artistId){
        try{
            const res = await this.request({ endpoint: `api/favorites/artists`, data: { userId, artistId }, method: 'post' });

            console.log(res.data);

            return res;
        } catch(err){
            console.error("Failed to add favorite artist:", err);
        }
    }

    static async getFavoriteArtist(userId, artistId){
        try{
            const res = await this.request({ endpoint: `api/favorites/artists/${artistId}`, data: { userId, artistId } });

            return res.data;
        } catch(err){
            console.error("Failed to get favorite artist:", err);
        }
    }

    static async getAllFavoriteArtists(userId){
        try{
            const res = await this.request({ endpoint: `api/favorites//${userId}/artists` });

            return res.data;
        } catch(err){
            console.error("Failed to get favorite artist:", err);
        }
    }

    static async deleteFavoriteArtist(userId, artistId){
        try{
            const res = await this.request({ endpoint: `api/favorites/artists`, data: { userId, artistId }, method: 'delete' });

            return res.data;
        } catch(err){
            console.error("Error deleting favorited artist:", err);
        }
    }
}

export default FavoritesAPI;