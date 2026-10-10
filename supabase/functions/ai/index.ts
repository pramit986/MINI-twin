import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // 1. PREVIEW ENDPOINT
    if (path === 'preview') {
      const { feature, input } = await req.json()
      
      // We would gather data based on feature here using supabaseClient.
      // E.g., if feature === 'workout_plan_draft', we query health_profiles
      const { data: profile } = await supabaseClient.from('health_profiles').select('height_cm, goal, equipment, injuries').eq('user_id', user.id).single()

      const previewPayload = {
        input,
        healthContext: profile,
      }
      
      const consent_token = crypto.randomUUID()
      // Store consent token in a DB or KV store in production. Here we mock it.

      return new Response(
        JSON.stringify({
          consent_token,
          categories: ['health goals', 'injuries', 'equipment'],
          payload_preview: previewPayload
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. RUN ENDPOINT
    if (path === 'run') {
      const { consent_token, input } = await req.json()
      
      if (!consent_token) throw new Error('Missing consent token')

      const apiKey = Deno.env.get('GEMINI_API_KEY')
      if (!apiKey) {
        return new Response(
          JSON.stringify({ answer: "AI unavailable right now (No API key)", why: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash'
      
      // In a real app we fetch the actual payload using the consent token from DB.
      // Here we construct a direct prompt for demo purposes.
      const prompt = `System: You are a study-life assistant. Data: ${JSON.stringify(input)}`

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                answer: { type: "STRING" },
                why: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["answer"]
            }
          }
        })
      })

      const data = await geminiRes.json()
      let answerJson = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (answerJson) {
        try {
           answerJson = JSON.parse(answerJson)
        } catch (e) {
           answerJson = { answer: answerJson }
        }
      } else {
        answerJson = { answer: "AI unavailable right now", why: [] }
      }

      // Log consent
      await supabaseClient.from('ai_consent_log').insert({
        user_id: user.id,
        feature: 'unknown',
        categories: [],
        payload_hash: consent_token,
        approved_at: new Date().toISOString(),
        model,
        status: 'success'
      })

      return new Response(
        JSON.stringify(answerJson),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
