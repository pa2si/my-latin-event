import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { genres } from '@/utils/genres';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCookies } from 'next-client-cookies';

interface GenresSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function GenresSelectionDialog({ isOpen, onOpenChange }: GenresSelectionDialogProps) {
    const [showAlert, setShowAlert] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const cookies = useCookies();

    const handleSelect = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            if (selectedGenres.length > 1) {
                setSelectedGenres(prev => prev.filter(g => g !== genre));
            } else {
                setShowAlert(true);
            }
        } else {
            setSelectedGenres(prev => [...prev, genre]);
        }
    };

    const handleSave = () => {
        if (selectedGenres.length > 0) {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            cookies.set('selectedGenres', JSON.stringify(selectedGenres), { expires });
            onOpenChange(false); // Use onOpenChange instead of setIsOpen
        }
    };

    const handleOpenChange = (open: boolean) => {
        // Only allow closing if there are selected genres
        if (!open && selectedGenres.length === 0) {
            return;
        }

        if (!open && selectedGenres.length > 0) {
            handleSave();
        }

        onOpenChange(open);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle>Select Your Music Preferences</DialogTitle>
                        <DialogDescription>
                            Choose at least one genre to see events that match your interests.
                            You can modify these preferences later.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid gap-4 py-4">
                            {genres.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleSelect(item.label)}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        selectedGenres.includes(item.label) && "text-primary"
                                    )}
                                >
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {selectedGenres.includes(item.label) && (
                                        <Check className="h-4 w-4 ml-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="flex-shrink-0">
                        <Button
                            onClick={handleSave}
                            disabled={selectedGenres.length === 0}
                            variant="default"
                            className="w-full "
                        >
                            Save Preferences
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogTitle>Cannot Remove Genre</AlertDialogTitle>
                    <AlertDialogDescription>
                        You must maintain at least one genre selection to help us show you relevant events.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <Button
                            onClick={() => setShowAlert(false)}
                            variant="default"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            OK
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}