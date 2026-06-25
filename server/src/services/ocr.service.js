import Tesseract from "tesseract.js";


export const extractImageText = async(path)=>{


    const result = await Tesseract.recognize(
        path,
        "eng"
    );


    console.log(
        "TEXT FROM IMAGE:",
        result.data.text
    );


    return result.data.text;


};
