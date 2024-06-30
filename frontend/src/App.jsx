import { useState } from 'react'
import './App.css'
import Sidebar from './components/User/Sidebar/Sidebar.jsx'
import MainComponent from './components/User/MainComponent/MainComponent.jsx'
import MusicPlayer from './components/User/MusicPlayer/MusicPlayer.jsx'
function App() {

  return (
    <>
    <div className='bg-black w-screen h-screen flex p-2 gap-2'>
    <div className=' resize-x w-96  cursor-pointer'>
    <Sidebar/>
    
    </div>
    <main className='w-full' >
      <MainComponent/>
    
          </main>
          <div className="fixed bottom-0 w-full ">
       {/* <MusicPlayer/> */}
       </div>
    </div>
    </>
  )
}

export default App
