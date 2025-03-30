import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "daradermody@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  }
})

export async function POST(req: Request) {
  const { message } = await req.json() as { message: string }
  await transporter.sendMail({
    from: '"Dara Dermody" <daradermody@gmail.com>',
    to: "daradermody@gmail.com",
    subject: "Feedback submitted on Viper Chronicles",
    text: message,
    html: message,
  });
  return new Response(null, { status: 204 })
}
