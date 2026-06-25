import { PDFParse } from "pdf-parse";


export const extractPdfText = async (url)=>{


    const response = await fetch(url);


    if(!response.ok){
        throw new Error("Failed to download PDF");
    }


    const arrayBuffer = await response.arrayBuffer();


    const buffer = Buffer.from(arrayBuffer);


    console.log("PDF SIZE:", buffer.length);


    if(buffer.length === 0){

        throw new Error("Downloaded PDF is empty");

    }


    const parser = new PDFParse({
        data: buffer
    });


    const result = await parser.getText();


    await parser.destroy();

    return result.text;

}