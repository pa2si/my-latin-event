import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, isToday as isDateToday } from 'date-fns';
import { Upload } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { EventCardProps } from '@/utils/types';
import EventCard from '../card/EventCard';

// Props for DayCard component
interface DayCardProps {
    day: Date;
    likeIds: Record<string, string | null>;
    events: EventCardProps[];
    view: 'day' | 'week' | 'month';
}

const DayCard = ({ day, events, view, likeIds }: DayCardProps) => {

    const router = useRouter();
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const hasEvents = events.length > 0;
    const isToday = isDateToday(day);

    const handleDayClick = () => {
        if (hasEvents) {
            if (events.length === 1) {
                router.push(`/events/${events[0].id}`);
            }
        } else {
            router.push(`/events/create?date=${format(day, 'yyyy-MM-dd')}`);
        }
    };

    useEffect(() => {
        if (!carouselApi) return;

        setCurrentSlide(carouselApi.selectedScrollSnap());

        carouselApi.on('select', () => {
            setCurrentSlide(carouselApi.selectedScrollSnap());
        });
    }, [carouselApi]);

    // Define CSS classes based on the view
    const baseClasses = 'relative bg-neutral-50';
    const weekViewClass = view === 'week'
        ? 'flex-1 min-w-[140px] max-w-[160px] h-[226px] md:min-w-[280px] md:h-[300px] md:max-w-[280px]'
        : '';
    const monthViewClass = view === 'month'
        ? 'flex-1 min-w-[140px] max-w-[100px] md:min-w-[170px] md:max-w-[170px] h-[230px]'
        : '';
    const dayViewClass = view === 'day'
        ? 'max-w-[600px] cursor-default w-[500px] h-[540px]'
        : '';

    // Render content based on the view and events
    const renderEventContent = () => {
        if (view === 'day' && hasEvents) {
            return (
                <div className="w-full h-full relative rounded-lg overflow-visible">
                    {events.length === 1 ? (
                        <div
                            className="relative w-full h-full min-h-[400px] md:min-h-[500px] cursor-pointer group"
                            onClick={() => router.push(`/events/${events[0].id}`)}
                        >
                            <Image
                                src={events[0].image}
                                alt={events[0].name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <h3 className="text-white font-semibold">
                                    {events[0].name}
                                </h3>
                            </div>
                        </div>
                    ) : (
                        <div className="relative h-full overflow-visible">
                            <Carousel
                                setApi={setCarouselApi}
                                className="w-full h-[500px]"
                                opts={{
                                    align: 'start',
                                    loop: true,
                                }}
                            >
                                <CarouselContent>
                                    {events.map((event, index) => (
                                        <CarouselItem key={event.id}>
                                            <div
                                                className="relative w-full h-[500px] cursor-pointer group"
                                                onClick={() => router.push(`/events/${event.id}`)}
                                            >
                                                <Image
                                                    src={event.image}
                                                    alt={event.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity mb-8">
                                                    <h3 className="text-white font-semibold">
                                                        {event.name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {events.length > 1 && (
                                    <>
                                        <CarouselPrevious
                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                                        />
                                        <CarouselNext
                                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                                        />
                                    </>
                                )}
                            </Carousel>
                            <div className="absolute left-0 right-0 bottom-0 py-2 text-center text-base text-muted-foreground bg-white">
                                Event {currentSlide + 1} of {events.length}
                            </div>
                        </div>
                    )}
                </div>
            );
        } else if (hasEvents) {
            return (
                <Sheet>
                    <SheetTrigger asChild>
                        <div className={`
                            relative
                            ${events.length === 1 ? 'w-full h-full cursor-pointer group' : `
                                grid gap-1 w-full h-full cursor-pointer group
                                ${events.length === 2 ? 'grid-rows-2' : ''}
                                ${events.length === 3 ? 'grid-cols-2 grid-rows-2' : ''}
                                ${events.length >= 4 ? 'grid-cols-2 grid-rows-2' : ''}
                            `}
                        `}>
                            {events.length === 1 ? (
                                <>
                                    <Image
                                        src={events[0].image}
                                        alt={events[0].name}
                                        fill
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <h3 className="text-white font-semibold">
                                            {events[0].name}
                                        </h3>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {events.slice(0, 4).map((event, index) => (
                                        <div
                                            key={event.id}
                                            className={`relative h-full ${events.length === 3 && index === 2 ? 'col-span-2 row-span-1' : ''}`}
                                        >
                                            <Image
                                                src={event.image}
                                                alt={event.name}
                                                fill
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {events.length > 4 && (
                                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                                            +{events.length - 4}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <h3 className="text-white font-semibold">
                                            Click to view all events
                                        </h3>
                                    </div>
                                </>
                            )}
                        </div>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                        <div className="absolute top-0 left-0 right-0 bg-background p-6 border-b z-10">
                            <SheetHeader>
                                <SheetTitle className="text-xl">
                                    Events on {format(day, 'EEEE, MMMM d, yyyy')}
                                </SheetTitle>
                            </SheetHeader>
                        </div>
                        <div className="flex-1 overflow-y-auto pt-[85px]">
                            <div className="grid gap-6 p-6 pt-0">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => router.push(`/events/${event.id}`)}
                                        className="cursor-pointer"
                                    >
                                        <EventCard
                                            event={event}
                                            inSheet={true}
                                            likeId={likeIds[event.id] ?? null}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            );
        } else {
            return (
                <div
                    onClick={handleDayClick}
                    className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:cursor-pointer"
                >
                    <Upload className={`${view === 'day' ? 'h-8 w-8 mb-2' : 'h-7 w-7 mb-2'}`} />
                    <span className={`${view === 'day' ? 'text-[1.5rem]' : 'text-[1.1rem]'}`}>Create Event</span>
                </div>
            );
        }
    };

    return (
        <div
            className={`
                ${baseClasses} 
                ${weekViewClass} 
                ${monthViewClass} 
                ${dayViewClass}
                rounded-lg overflow-hidden shadow-md
                ${view !== 'day' ? 'transform transition-transform duration-200 hover:scale-105 hover:shadow-xl' : ''}
                flex flex-col relative
            `}
        >
            {/* Header displaying the day and date */}
            <div className={`
                flex flex-row justify-between items-center 
                p-1 md:p-2 ${view === 'day' ? 'p-2 md:p-3' : ''} rounded-0
                ${isToday ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
            `}>
                {/* Day of the week */}
                <span className={`text-xs md:text-sm ${view === 'day' ? 'text-base md:text-lg' : ''} font-medium`}>
                    {format(day, 'EEE')}
                </span>
                {/* Date */}
                <div className={`text-xs md:text-sm ${view === 'day' ? 'text-base md:text-lg' : ''}`}>
                    <span>{format(day, 'dd')}</span>
                    <span className="text-muted-foreground">{format(day, ' MMM')}</span>
                </div>
            </div>

            {/* Event content section */}
            <div className="relative flex-1 overflow-visible p-0 bg-secondary/5">
                {renderEventContent()}
            </div>
        </div>
    );
};

export default DayCard;