import React from 'react'

function PlaylistCard({playListName,username}) {
  return (
    <div className='w-full flex hover:bg-neutral-800 p-2 rounded-md'>
      <div  className='w-12 h-12 overflow-hidden rounded-md'>
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcRvy1mbT2t3lXOf7cyq-nmlTvH0JRajHbeNduLBc2rUSwgKGNnFIKR4coTFWvarASckWJhW88QP3hagZQ5py9RsDGD866MiuHJ2RckpcL7tV-kGkZIAETP5GqZOXjyY6NYmi83vmZ9oxL/s1600/Shahrukh-Khan-Latest.jpg" alt="" />
      </div>
      <div>
        <h2 className='font-semibold text-nowrap'>{playListName|| "My PLaylist"}</h2>
        <div className='flex gap-1'>

      <p className='text-xs text-white/70'>Playlist</p>
      <p className='items-center'>.</p>
      <p className='text-xs text-white/70'>{username|| "Danish Khan"}</p>
        </div>
      </div>


    </div>
  )
}

export default PlaylistCard