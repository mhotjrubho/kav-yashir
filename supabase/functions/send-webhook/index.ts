import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  type: 'complaint' | 'registration';
  data: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get('WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.log('WEBHOOK_URL not configured, skipping webhook');
      return new Response(
        JSON.stringify({ success: true, message: 'Webhook not configured, skipped' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, data } = await req.json() as WebhookPayload;

    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing type or data in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${type} webhook request`);
    console.log('Webhook payload with keys:', JSON.stringify(data, null, 2));

    // Forward to Google Apps Script webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log(`Webhook response status: ${response.status}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    // Return success even if webhook fails - we don't want to block the main flow
    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processing completed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
