import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function DummyProjApp() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-screen h-screen bg-gray-700 flex flex-col justify-center items-center">
      <div className='flex flex-row gap-4'>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="flex flex-col justify-center items-center m-4 gap-4">
        <button onClick={() => setCount((count) => count + 1)}
          className='bg-gray-800 rounded-2xl text-white p-4 font-bold hover:bg-gray-950 duration-100'>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default DummyProjApp
