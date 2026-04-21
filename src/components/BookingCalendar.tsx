import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { createBooking, getTutorBookingsForDate } from "@/lib/api";

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
    const { user } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Fetch booked slots when date changes
    useEffect(() => {
        if (!date) return;

        const fetchBookedSlots = async () => {
            const dateStr = format(date, "yyyy-MM-dd");
            const { data } = await getTutorBookingsForDate(tutorId, dateStr);
            setBookedSlots(data.map((b) => b.time_slot));
        };

        fetchBookedSlots();
    }, [date, tutorId]);

    const isSlotUnavailable = (time: string) => {
        return bookedSlots.includes(time);
    };

    const handleBook = async () => {
        if (!date || !selectedSlot) return;

        if (!user) {
            toast.error("Please log in to book a lesson", {
                description: "You need an account to book tutoring sessions.",
                action: {
                    label: "Log in",
                    onClick: () => window.location.href = "/login",
                },
            });
            return;
        }

        if (user.id === tutorId) {
            toast.error("You can't book a lesson with yourself!");
            return;
        }

        setIsBooking(true);

        const { data, error } = await createBooking({
            tutor_id: tutorId,
            student_id: user.id,
            booking_date: format(date, "yyyy-MM-dd"),
            time_slot: selectedSlot,
            hourly_rate: hourlyRate,
        });

        setIsBooking(false);

        if (error) {
            toast.error("Failed to book lesson", {
                description: error.message,
            });
            return;
        }

        toast.success("Booking confirmed!", {
            description: `Your session is scheduled for ${format(date, "MMMM do")} at ${selectedSlot}.`,
        });

        // Add the newly booked slot to the list
        setBookedSlots((prev) => [...prev, selectedSlot]);
        setSelectedSlot(null);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar Section */}
            <Card>
                <CardContent className="p-4 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            setDate(d);
                            setSelectedSlot(null);
                        }}
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
                                const disabled = isSlotUnavailable(time);
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
                                        {disabled && (
                                            <span className="ml-auto text-xs text-muted-foreground">Booked</span>
                                        )}
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
