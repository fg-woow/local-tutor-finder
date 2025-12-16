import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookingCalendarProps {
    tutorId: string;
    hourlyRate: number;
}

const TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
];

const BookingCalendar = ({ tutorId, hourlyRate }: BookingCalendarProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    // Mock function to check if a slot is unavailable (randomly)
    const isSlotUnavailable = (time: string, selectedDate: Date) => {
        // Just for demo purposes, make same-day slots partially unavailable
        if (selectedDate.toDateString() === new Date().toDateString()) {
            return ["09:00 AM", "10:00 AM"].includes(time);
        }
        return false;
    };

    const handleBook = () => {
        if (!date || !selectedSlot) return;

        setIsBooking(true);

        // Simulate API call
        setTimeout(() => {
            setIsBooking(false);
            toast.success("Booking confirmed!", {
                description: `Your session is scheduled for ${format(date, "MMMM do")} at ${selectedSlot}.`,
            });
            setSelectedSlot(null);
        }, 1500);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar Section */}
            <Card>
                <CardContent className="p-4 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-sm"
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                </CardContent>
            </Card>

            {/* Slots Section */}
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        {date ? format(date, "EEEE, MMMM do, yyyy") : "Select a date"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Select a time slot for your {hourlyRate > 0 ? `$${hourlyRate}/hr` : "free"} lesson.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {date ? (
                            TIME_SLOTS.map((time) => {
                                const disabled = isSlotUnavailable(time, date);
                                return (
                                    <Button
                                        key={time}
                                        variant={selectedSlot === time ? "default" : "outline"}
                                        className={`justify-start h-auto py-3 px-4 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                        disabled={disabled}
                                        onClick={() => !disabled && setSelectedSlot(time)}
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        {time}
                                    </Button>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-8 text-center text-muted-foreground border rounded-md border-dashed">
                                Please select a date from the calendar to view available times.
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Summary & Action */}
                {selectedSlot && date && (
                    <div className="rounded-lg border bg-accent/20 p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium">Ready to book?</h4>
                                <p className="text-sm text-muted-foreground">
                                    {format(date, "MMM do")} at {selectedSlot}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="outline">1 Hour</Badge>
                                    <Badge variant="outline">${hourlyRate}</Badge>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleBook}
                            disabled={isBooking}
                        >
                            {isBooking ? "Confirming..." : "Confirm Booking"}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Free cancellation up to 24 hours before the lesson.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCalendar;
