import React from "react";
import { IoClose } from 'react-icons/io5'
import Image from 'next/image'

function PhotoLibrary({ setImage, hidePhotoLibrary }) {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
      <div className="max-h-[90vh] max-w-[90vw] bg-gray-900 gap-6 rounded-lg p-4">
        <div onClick={() => hidePhotoLibrary(false)} className="pt-2 pr-2 cursor-pointer flex items-end justify-end">
          <IoClose className="h-10 w-10 cursor-pointer" />
        </div>
        <div className="grid grid-cols-3 justify-center items-center gap-16 p-20 w-full">
          {images.map((image, index) => (
            <div key={index} onClick={() => {
              setImage(images[index]);
              hidePhotoLibrary(false);
            }} className="relative cursor-pointer h-24 w-24">
              <Image src={image } alt="avatar" fill/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
