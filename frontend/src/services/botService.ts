import { fetcher } from "@/utils/fetcher";



export const GetListBots = async (credentials: any) => {
    const response = await fetcher("/bots/", {
      method: "GET",
      body: JSON.stringify(credentials),
    }, true);
  
    return response;
  };

  export const GetById = async (credentials: any) => {
    const response = await fetcher("/bots", {
      method: "POST",
      body: JSON.stringify(credentials),
    }, true);
  
    return response;
  };

  export const CreateBot = async (credentials: any) => {
    const response = await fetcher("/bots", {
      method: "POST",
      body: JSON.stringify(credentials),
    }, true);
  
    return response;
  };


  export const UpdateById = async (credentials: any) => {
    const response = await fetcher("/bots", {
      method: "POST",
      body: JSON.stringify(credentials),
    }, true);
  
    return response;
  };

  export const DeleteById = async (credentials: any) => {
    const response = await fetcher("/bots", {
      method: "POST",
      body: JSON.stringify(credentials),
    }, true);
  
    return response;
  };


  