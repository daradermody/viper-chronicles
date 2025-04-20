import { Card, CardContent, CardMedia } from '../cards/Cards'
// @ts-ignore
import netCafeLogo from '../images/netCafe.jpg'

export default function Home() {
  return (
    <div>
      <p>Watch and enjoy the magic that Stewart Cheifet and his team created.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: 'fit-content' }}>
        <Card linkTo="/computerChronicles">
          <CardMedia
            style={{ minHeight: '162px' }}
            image="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhpHOVabggF_Fg7IYqB9KqA-xBpZxgoyI5ZmNivsKr-S9C9aAKnfquHU5Y0cK9ai8vpMvj8ugMoCZ9FFF7_FPl3mQ5wkjn4ZRYE12nBBX235dLN-W1i1C8KJw_56z3ZDwnHDNrf/s1600/chronicles.jpg"
            alt="Computer Chronicles"
          />
          <CardContent
            title="Computer Chronicles"
            subtitle="1984–2002"
            description="Computer Chronicles is an American half-hour television series that was broadcast on PBS public television from 1984 to 2002."
          />
        </Card>
        <Card linkTo="/netCafe">
          <CardMedia image={netCafeLogo} alt="Computer Chronicles"/>
          <CardContent
            title="Net Cafe"
            subtitle="1996–2002"
            description="A spin-off of Computer Chronicles, Net Cafe (or Cheifet's Net Cafe or The Internet Cafe) was a US television series documenting the internet boom of the late 1990s"
          />
        </Card>
      </div>
    </div>
  )
}
