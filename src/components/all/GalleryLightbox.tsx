// components/GalleryLightbox.tsx
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function GalleryLightbox({
  images,
  open,
  setOpen,
  index,
  setIndex,
}: {
  images: { src: string; alt?: string }[];
  open: boolean;
  setOpen: (val: boolean) => void;
  index: number;
  setIndex: (val: number) => void;
}) {
  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      index={index}
      slides={images}
      on={{
        view: ({ index }) => setIndex(index),
      }}
    />
  );
}
