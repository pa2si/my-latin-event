import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const Portal = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return mounted ? createPortal(children, document.body) : null;
};

interface ModalCarouselProps {
    isOpen: boolean;
    onClose: () => void;
    images: { url: string; name: string; id: string }[];
}

const ModalCarousel = ({ isOpen, onClose, images }: ModalCarouselProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleImageClick = (id: string) => {
        window.location.href = `/events/${id}`;
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/90"
                    onClick={onClose}
                />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Main Content Container - Optimized for flyer aspect ratio */}
                <div className="relative z-50 h-[90vh] w-auto px-16">
                    <Carousel className="h-full">
                        <CarouselContent>
                            {images.map((image, index) => (
                                <CarouselItem key={index} className="h-full">
                                    <div
                                        className="flex h-full cursor-pointer items-center justify-center"
                                        onClick={() => handleImageClick(image.id)}
                                    >
                                        <div className="relative">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="h-[85vh] w-auto object-contain"
                                                style={{
                                                    aspectRatio: '3/4',
                                                    objectPosition: 'center'
                                                }}
                                            />

                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {images.length > 1 && (
                            <>
                                <CarouselPrevious className="-left-12" />
                                <CarouselNext className="-right-12" />
                            </>
                        )}
                    </Carousel>
                </div>
            </div>
        </Portal>
    );
};

export default ModalCarousel;