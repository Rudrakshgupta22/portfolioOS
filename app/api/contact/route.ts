import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, replyTo, topic, message } = await request.json();

    if (!name || !replyTo || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Secure Comms <onboarding@resend.dev>',
      // CRITICAL FIX: Changed to the email associated with your Resend account
      to: ['grudraksh2007@gmail.com'], 
      replyTo: replyTo,
      subject: `[Portfolio] ${topic} - From ${name}`,
      text: `
        Name: ${name}
        Email: ${replyTo}
        Topic: ${topic}

        Message:
        ${message}
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('❌ Internal Server Error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}