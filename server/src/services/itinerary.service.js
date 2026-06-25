import { generateAIItinerary } from "./gemini.service.js";


export const createItinerary = async(text)=>{


const result = await generateAIItinerary(text);


try{

return JSON.parse(result);


}catch(error){

return {
    raw:result
}

}


}