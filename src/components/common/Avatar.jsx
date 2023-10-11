import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { FaCamera } from 'react-icons/fa'
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [contextMenuCoordidnates, setContextMenuCoordidnates] = useState({
    x: 0,
    y: 0,
  })
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false)
  const [showCapturePhoto, setShowCapturePhoto] = useState(false)
  const showContextMenu = (e) => {
    e.preventDefault()
    setContextMenuCoordidnates({ x: e.pageX, y: e.pageY })
    setIsContextMenuVisible(true)
  }
  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker")
      data.click()
      document.body.onfocus = (e) => {
        setTimeout(() => {
          
          setGrabPhoto(false)
        }, 1000)
      }
    }
  }, [grabPhoto])
  

  const contextMenuOptions = [
    {
      name: "Take photo", callback: () => { 
      setShowCapturePhoto(true)
    } },
    {
      name: "Chose from library", callback: () => {
      setShowPhotoLibrary(true)
     } },
    {
      name: "Upload photo", callback: () => { 
      setGrabPhoto(true)
    }, },
    {
      name: "Remove photo", callback: () => {
      setImage('/default_avatar.png')
     } },
  ]
  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader()
    const data = document.createElement('img')
    reader.onload = function (event) {
      data.src = event.target.result;
      data.classList.add('w-60', 'h-60', 'm-auto')
      data.setAttribute('data-src', event.target.result)
    }
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src)
    }, 100);
    }
  return <>
    <div className="flex items-center justify-center">
      {type === 'sm' && (
        <div className="relative w-10 h-10">
          <Image src={image} alt="avatar" className="rounded-full" width={40} height={40} />
        </div>
      )}
      {type === 'lg' && (
        <div className="relative w-14 h-14">
          <Image src={image} alt="avatar" className="rounded-full" width={56} height={56} />
        </div>
      )}
      {type === 'xl' && (
        <div className="cursor-pointer z-0 relative" id="context-opener" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <div className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${hover ? "visible" : "hidden"}`} onClick={e => showContextMenu(e)} id="context-opener">
            <FaCamera className='text-2xl' id="context-opener" onClick={e => showContextMenu(e)} />
            <span id="context-opener" onClick={e => showContextMenu(e)}>Change profile photo</span>
          </div>
          <div className="w-60 h-60">
            <Image src={image} alt="avatar" className="rounded-full" width={240} height={240} />
          </div>
        </div>
      )}
    </div>
    {isContextMenuVisible &&
      (<ContextMenu options={contextMenuOptions} coordinates={contextMenuCoordidnates} contextMenu={isContextMenuVisible} setContextMenu={setIsContextMenuVisible} />)}
    {showPhotoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={ setShowPhotoLibrary } />}
    {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    {showCapturePhoto && <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />}
  </>;
}

export default Avatar;
