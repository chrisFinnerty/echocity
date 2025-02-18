import BaseAPI from "./BaseAPI";

class UsersAPI extends BaseAPI {
    static async signup(props) {
        try{
            const res = await this.request({
              endpoint: `auth/signup`,
              data: props,
              method: "post",
            });
            return res.data;
        } catch(err){
          console.error(err);
        }
      }
  
      static async login(props) {
        try{
          const res = await this.request({
            endpoint: `auth/login`,
            data: props,
            method: "post"
          });
          return res.data;
        } catch(err){
          console.error(err);
        }
      };

      static async logout(){
        await this.request({
          endpoint: `auth/logout`,
          method: "post"
        });
      }

      static async authenticate(){
        try{
          const res = await this.request({
            endpoint: `auth/authenticate`,
            method: "post",
            withCredentials: true
          })
          
          return res.data;
        } catch(err){
          console.error(err);
        };
      };

      static async getUserById(id){
        try{
          const res = await this.request({ endpoint: `api/users/${id}`});
          return res.data;
        } catch(err){
          throw new Error("Error getting user", err)
        }
      }

      static async editUserProfile(id, data){
        const res = await this.request({
          endpoint: `api/users/${id}`,
          data,
          method: 'patch'
        });
        return res.data;
      }
}

export default UsersAPI;