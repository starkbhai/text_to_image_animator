import { NextResponse } from 'next/server';
import { Client } from "@gradio/client";



export async function POST(req, res){
  if (req.method === 'POST') {
  const bodyData =  await new Response(req.body).json();
  console.log("bodyData :" , bodyData);
  
    try{
        const client = await Client.connect("black-forest-labs/FLUX.1-dev");
        const result = await client.predict("/infer", { 		
                prompt: "A hungry fox searching for food in a dense forest, looking around curiously, with tall trees and soft sunlight filtering through the leaves.", 		
                seed: 1927180962, 		
                randomize_seed: true, 		
                width: 256, 		
                height: 256, 		
                guidance_scale: 11, 		
                num_inference_steps: 70, 
        });
        return NextResponse.json({ data:result }, { status: 200 });

    }catch (error) {
        return NextResponse.json({ message: error }, { status: 404 })
    }
  }else{
    // Handle any other HTTP method
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
};