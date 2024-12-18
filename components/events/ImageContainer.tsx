"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

function ImageContainer({
  mainImage,
  name,
}: {
  mainImage: string;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section
        className="group relative h-[300px] cursor-pointer md:h-[500px]"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={mainImage}
          alt={name}
          className="absolute h-full w-full rounded-md object-cover transition-opacity duration-300"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2 text-white">
            <Maximize2 className="h-5 w-5" />
            <span>Click to enlarge</span>
          </div>
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-h-[90vh] max-w-[90vw] border-none bg-transparent p-0 animate-in animate-out fade-in-0 fade-out-0 zoom-in-95 zoom-out-95"
          onInteractOutside={() => setIsOpen(false)}
        >
          <div className="relative h-[90vh] w-full">
            <img
              src={mainImage}
              alt={name}
              className="h-full w-full rounded-md object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageContainer;
