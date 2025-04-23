
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { findAnswer } from "../sampleAnswers.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    // Try to use Gemini API
    try {
      const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
      // Update to use the most recent model version
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a helpful study assistant. Answer the following question in a clear and educational way: ${content}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Generated response from Gemini:', text);

      return new Response(
        JSON.stringify({ answer: text }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (aiError) {
      // If Gemini API fails, fall back to sample answers
      console.error('Gemini API error, falling back to sample answers:', aiError);
      const fallbackAnswer = findAnswer(content);
      
      console.log('Generated fallback response:', fallbackAnswer);
      
      return new Response(
        JSON.stringify({ answer: fallbackAnswer }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
