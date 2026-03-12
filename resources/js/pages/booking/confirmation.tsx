import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Rental } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Equipment', href: '/equipment' },
    { title: 'Booking Confirmation', href: '#' },
];

interface Props {
    rental: Rental;
}

export default function BookingConfirmation({ rental }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Booking Confirmed" />
            <div className="flex h-full flex-1 items-start justify-center p-4 md:p-6">
                <Card className="w-full max-w-lg">
                    <CardHeader className="items-center text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
                        <CardTitle className="text-2xl">Booking Request Submitted!</CardTitle>
                        <p className="text-muted-foreground text-sm">
                            Your booking request has been received. We will review and confirm it shortly.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Rental Number</span>
                                <span className="font-semibold">{rental.rental_number}</span>
                            </div>
                            {rental.equipment && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Equipment</span>
                                    <span className="font-semibold">{rental.equipment.name}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Start Date</span>
                                <span>{new Date(rental.start_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">End Date</span>
                                <span>{new Date(rental.end_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Quantity</span>
                                <span>{rental.quantity}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>${Number(rental.total_price).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button asChild className="flex-1">
                                <Link href="/customer/rentals">View My Rentals</Link>
                            </Button>
                            <Button asChild variant="outline" className="flex-1">
                                <Link href="/equipment">Back to Equipment</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
