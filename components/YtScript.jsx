"use client"
import axios from 'axios';
import React, { useState } from 'react'



const YtScript = () => {
    const [inputText, setInputText] = useState("");
    const [imageUrl , setImageUrl] = useState([]);
    
    const imagePrompts = [
        // Scene 1: A hungry fox searching for food
        "A hungry fox searching for food in a dense forest, looking around curiously, with tall trees and soft sunlight filtering through the leaves. The image should be highly detailed, with a vibrant, animated style and soft lighting effects to create a magical, high-quality feel. Use rich colors and a cinematic atmosphere for an enchanting forest scene.",
      
        // Scene 2: The fox stumbling upon a farmer’s wall
        "A curious fox discovers a stone farmer’s wall in a rural farmland setting with vibrant green fields and clear skies. Create a vibrant, high-quality animated image, with soft textures and dynamic lighting. The scene should feel warm and peaceful, with high-definition details in the environment and the fox’s fur texture.",
      
        // Scene 3: The fox sees big, purple, juicy grapes
        "Close-up of a bunch of big, purple, juicy grapes hanging from a vine on a farmer’s stone wall, with the fox looking up eagerly. The image should have an ultra-realistic animated look, with highly detailed grapes and fur, capturing the textures vividly. Emphasize high-quality lighting, glossy effects on the grapes, and a depth of field focus on the fox's eager eyes.",
      
        // Scene 4: The fox jumping to reach the grapes
        "A determined fox jumping towards a cluster of purple grapes high above on a farmer's wall, trying but struggling to reach them. Create an action-packed, high-quality animated scene with dynamic movement, capturing the fox’s motion in mid-air. Use crisp animation techniques to make the jump appear fluid, with dramatic lighting to highlight the fox’s energy and focus.",
      
        // Scene 5: The fox failing repeatedly
        "A disappointed fox sitting on the ground, looking exhausted after multiple failed attempts to reach the grapes, with an emotional expression. The image should feel emotionally charged with high-definition animation quality. Focus on the fox’s expressive eyes and body language. Use soft, muted colors to evoke a sense of defeat, with gentle lighting and subtle shading for a cinematic mood.",
      
        // Scene 6: The fox giving up and going home
        "A tired fox walking away from the farmer’s wall, head down in defeat, with a peaceful countryside setting in the background. Capture a serene, high-quality animated scene, with smooth, flowing animation. Use soft, warm colors for the sunset, and emphasize the fox's weary gait. Create a tranquil atmosphere, using high-definition details to evoke a sense of calm and reflection.",
      
        // Scene 7: The moral of the story
        "A thoughtful fox gazing back at the grapes, symbolizing the lesson that some things are out of reach and not worth hating, in a serene, quiet farm setting. This should be a reflective, high-quality animated image with a deep focus on the fox’s contemplative expression. Create a cinematic shot with soft lighting, rich textures, and vibrant colors. Add subtle animation effects to make the scene feel alive and dynamic, but with a calming tone."
      ];
      
      
    const handleInputChange = (e) => {
      setInputText(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();

       // Split the text by new lines and remove empty lines
        const prompts = inputText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => ({
            prompt: line,
            negative_prompt: "blurry, bad quality, distorted",  // Optional: default negative prompt
            steps: 30  // Optional: default steps for generation
        }));
        
        console.log(inputText);
        console.log('Generated prompts:', prompts);
    };

    const handleGenerateImages = async (e) => {
        e.preventDefault();
        console.log("Generating images...");
        imagePrompts.forEach(async (prompt) => {    
         try{
            const response = await axios.post("/api/imagegenerate", {
                prompts: prompt
            });
            console.log("response",response);
            setImageUrl((prev) => [...prev, response.data.data.data[0].url]);
         }catch(error){
            console.log("error",error);
         }      
        });
        
    };

    const downloadImages = () => {
        console.log("Downloading images...");
        imageUrl.forEach((url) => {
            const a = document.createElement("a");
            a.href = url;
            a.download = `image_${index + 1}.png`;
            a.click();
        }); 
    };  

    const realDownloadImages=(imgArr)=>{
        imageUrl.forEach(async (url, index) => {
            try {
                // Fetch the image first
                const response = await fetch(url);
                const blob = await response.blob();
                
                // Create object URL from blob
                const blobUrl = window.URL.createObjectURL(blob);
                
                // Create download link
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `image_${index + 1}.png`;
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error(`Error downloading image ${index + 1}:`, error);
            }
        }); 
    }

    const downloadAllImages = async () => {
        console.log("Downloading all images...");
        try{
            const response = await axios.get("https://cdn.tfrv.xyz/projects/AY8EyQ5R1H6Vvnp4JApK.json");
            console.log("response :L " , response?.data?.slides);

            response?.data?.slides?.forEach(async(val , index)=>{
                let imgUrl = val?.mediaList[0]?.url;
                console.log(imgUrl);
                if(imgUrl){
                    try {
                        // Fetch the image
                        const imgResponse = await fetch(imgUrl);
                        const blob = await imgResponse.blob();
                        
                        // Create object URL from blob
                        const blobUrl = window.URL.createObjectURL(blob);
                        
                        // Create download link
                        const a = document.createElement("a");
                        a.href = blobUrl;
                        a.download = `image_${index + 1}.png`;
                        document.body.appendChild(a);
                        a.click();
                        
                        // Cleanup
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(blobUrl);
                    } catch (error) {
                        console.error(`Error downloading image ${index + 1}:`, error);
                    }
                }

            })

        }catch(error){
            console.log("error",error);
        }
    };  

   console.log("imageUrl",imageUrl);
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
    <h1>Text to Image Animator</h1>
    <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-4 text-black'>
      <textarea rows={10} cols={40} type="text" placeholder="Enter text" className='p-2 rounded-md text-black' onChange={handleInputChange}/>
      <button type="submit" className='bg-blue-500 text-white p-2 rounded-md'>Generate</button>
    </form>
      <div className = "grid grid-cols-3 gap-4 w-full">
        {imageUrl.map((url, index) => (
          <img key={index} src={url} alt={`Generated Image ${index + 1}`} className='w-full h-full object-cover' />
        ))}
      </div>
      {imageUrl?.length > 0 && <button onClick={downloadImages} className='bg-blue-500 text-white p-2 rounded-md'>Download Images</button>}
      <button onClick={handleGenerateImages} className='bg-blue-500 text-white p-2 rounded-md'>Generate Images</button>

      <button onClick={downloadAllImages} className='bg-blue-500 text-white p-2 rounded-md'>Download All Images from json</button>
 </div>
  )
}

export default YtScript;
