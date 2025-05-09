"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function GalleryClient({ images, title }: { images: string[]; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const getAllImages = () => images?.map((src) => ({ src: src || "/placeholder.jpg" })) || [];

  return (
    <>
      <div
        className="relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => { setPhotoIndex(0); setIsOpen(true); }}
      >
        <Image
          src={images?.[0] || "/placeholder.jpg"}
          alt={title || "Off Plan Property"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 left-4">
          <button
            className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
            onClick={e => { e.stopPropagation(); setPhotoIndex(0); setIsOpen(true); }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {images?.length || 0} photos
          </button>
        </div>
      </div>
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={getAllImages()}
        index={photoIndex}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
          },
        }}
      />
    </>
  );
} 