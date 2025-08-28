import { Router } from "react-router-dom"
import LetterBoxed  from "./gamesapps/letterboxed.jsx"


const AllGames = {
    letterboxedunlimited:{
        name:"Letter Boxed",
        desc:"Unlimited version of the NYT Letter Boxed game",
        component:<LetterBoxed/>,
    },
    wordle:{
        name:"Wordle",
        desc:"The NYT Wordle game",
        href:"https://www.nytimes.com/games/wordle/index.html"
    }
}

function GamesPage() {
   
    return <div className="w-screen h-fit min-h-screen grid grid-cols-4">
        {Object.entries(AllGames).map((key, value) => {
            return <Links to="">
                <span>{value.name}</span>
            </Links>
        })}
    </div>
}

function GamesRouter() {
    return (
    <Route path="games/">
        <Route index element={<GamesPage/>}/>
        {Object.entries(AllGames).map(([path, game]) => {
            <div key={path} className="m-4 p-4 border rounded shadow-md">
            {game.href ? (
                // Render an external link for games with an 'href' property
                <a href={game.href} target="_blank" rel="noopener noreferrer">
                <span>{game.name}</span>
                </a>
            ) : (
                // Render a React Router Link for internal pages
                <Link to={path}>
                <span>{game.name}</span>
                </Link>
            )}
            </div>
        })}
    </Route>)
}

export default {Games: GamesPage, GamesRouter};