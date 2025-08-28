// App.jsx
import { Outlet, createRoutesFromElements, Route, RouterProvider, Link, createHashRouter } from 'react-router-dom';
import Home from './pages/home'; // Assuming you move these to separate files
import Aboutme from './pages/aboutme'; // Assuming you move these to separate files
import LetterBoxed from './pages/gamesapps/letterboxed';
import { cn } from './cn';
import Games from './pages/games';


// You will also need a Layout component or to define a root route element
// For this example, let's assume a basic layout component.
function RootLayout() {
  return (
    <div className='h-fit w-full relative'>
      <nav className='bg-[#326273] pl-2 pr-2 p-1 text-white flex flex-row h-fit space-x-4 justify-start items-center gap-4'>
        <Link to="/" className = {cn(
          "duration-100 rounded-2xl w-fit p-2 pl-4 pr-4 m-0",
          "hover:bg-black/10"
        )}>Home</Link>
        <Link to="/aboutme" className = {cn(
          "duration-100 rounded-2xl w-fit p-2 pl-4 pr-4 m-0",
          "hover:bg-black/10"
        )}>About Me</Link>
        <ul
        className = {cn(
          "relative group duration-100 rounded-2xl w-fit p-2 pl-4 pr-4 m-0",
          "hover:bg-black/10"
        )}
        > 
          <span className='cursor-pointer'>Games</span>
          <div className='grow bg-blue-300 absolute overflow-y-hidden max-h-0 group-hover:max-h-screen duration-800 w-fit'>
            <Link to="/games/letterboxedunlimited" className="text-nowrap">Letter Boxed</Link>
          </div>
        </ul>
      </nav>
      {/* This is where the nested routes will be rendered */}
      <Outlet />
    </div>
  );
}


const router = createHashRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element = {<RootLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="aboutme/" element = {<Aboutme/>}/>
      <Route path="games/">
        <Route index element={<Games/>}/>
        <Route path="/games/letterboxedunlimited" element = {<LetterBoxed/>}/>
      </Route>
    </Route>
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;