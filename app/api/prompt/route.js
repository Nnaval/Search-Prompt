import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";


export const GET = async(request) => {
    try {
        await connectToDB();
            console.log('about to fetch prompt');
        const prompts = await Prompt.find({}).populate('creator');
                console.log(prompts);
        return new Response(JSON.stringify(prompts), {status:200})
    } catch (error) {
        
        return new Response('failed to fetch all prompts', {status:500})

    }
}