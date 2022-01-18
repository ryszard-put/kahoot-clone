import JoinRoom from "../forms/JoinRoom"
import SignIn from "../forms/SignIn"

const Home = () => {
  return <div className="grid">
    <article>
      <hgroup>
        <h1>Zaloguj się</h1>
        <h3>Twórz i nadzoruj quizy</h3>
      </hgroup>
      <SignIn />
    </article>
    <article>
      <hgroup>
        <h1>Dołącz do pokoju</h1>
        <h3>Graj i baw się dobrze</h3>
      </hgroup>
      <JoinRoom />
    </article>
  </div>
}

export default Home