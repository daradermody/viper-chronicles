export async function POST(req: Request) {
  const { password } = await req.json() as { password: string }
  if (!!process.env.LOGIN_PASSWORD && password !== process.env.LOGIN_PASSWORD) {
    return new Response('Invalid password', { status: 401 })
  } else {
    return new Response('OK', { status: 200 })
  }
}
