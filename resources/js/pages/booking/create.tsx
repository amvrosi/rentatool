import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';
import type { Equipment } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Equipment', href: '/equipment' },
    { title: 'Book', href: '#' },
];

interface Props {
    equipment: Equipment;
}

export default function BookingCreate({ equipment }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        equipment_id: equipment.id,
        start_date: '',
        end_date: '',
        quantity: 1,
        notes: '',
        delivery_address: '',
    });

    const rentalDays = useMemo(() => {
        if (!data.start_date || !data.end_date) return 0;
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    }, [data.start_date, data.end_date]);

    const totalPrice = useMemo(() => {
        return rentalDays * Number(equipment.daily_rate) * data.quantity;
    }, [rentalDays, equipment.daily_rate, data.quantity]);

    const depositTotal = useMemo(() => {
        return Number(equipment.deposit_amount) * data.quantity;
    }, [equipment.deposit_amount, data.quantity]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/booking');
    }

    const primaryImage = equipment.primary_image ?? equipment.images?.[0];
    const today = new Date().toISOString().split('T')[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Book ${equipment.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Book Equipment</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Equipment Summary + Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Equipment Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Equipment Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        {primaryImage && (
                                            <img
                                                src={primaryImage.url}
                                                alt={primaryImage.alt_text ?? equipment.name}
                                                className="h-40 w-40 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">{equipment.name}</h3>
                                            {equipment.short_description && (
                                                <p className="text-muted-foreground text-sm">{equipment.short_description}</p>
                                            )}
                                            <div className="text-sm space-y-1">
                                                <p>Daily Rate: <span className="font-semibold">${Number(equipment.daily_rate).toFixed(2)}</span></p>
                                                {equipment.weekly_rate && (
                                                    <p>Weekly Rate: <span className="font-semibold">${Number(equipment.weekly_rate).toFixed(2)}</span></p>
                                                )}
                                                {equipment.monthly_rate && (
                                                    <p>Monthly Rate: <span className="font-semibold">${Number(equipment.monthly_rate).toFixed(2)}</span></p>
                                                )}
                                                <p>Deposit: <span className="font-semibold">${Number(equipment.deposit_amount).toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Booking Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date">Start Date</Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                min={today}
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                            />
                                            {errors.start_date && <p className="text-destructive text-sm">{errors.start_date}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_date">End Date</Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                min={data.start_date || today}
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                            />
                                            {errors.end_date && <p className="text-destructive text-sm">{errors.end_date}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min={1}
                                            max={equipment.available_quantity ?? equipment.quantity}
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', parseInt(e.target.value) || 1)}
                                            className="w-32"
                                        />
                                        {errors.quantity && <p className="text-destructive text-sm">{errors.quantity}</p>}
                                        <p className="text-muted-foreground text-xs">
                                            {equipment.available_quantity ?? equipment.quantity} available
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="delivery_address">Delivery Address</Label>
                                        <Input
                                            id="delivery_address"
                                            value={data.delivery_address}
                                            onChange={(e) => setData('delivery_address', e.target.value)}
                                            placeholder="Enter delivery address (optional)"
                                        />
                                        {errors.delivery_address && <p className="text-destructive text-sm">{errors.delivery_address}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <textarea
                                            id="notes"
                                            className="border-input placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:opacity-50"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Any special requirements or notes..."
                                        />
                                        {errors.notes && <p className="text-destructive text-sm">{errors.notes}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Price Summary Sidebar */}
                        <div>
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Price Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Daily Rate</span>
                                        <span>${Number(equipment.daily_rate).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Duration</span>
                                        <span>{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Quantity</span>
                                        <span>{data.quantity}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-semibold">
                                        <span>Rental Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Deposit (refundable)</span>
                                        <span>${depositTotal.toFixed(2)}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Due</span>
                                        <span>${(totalPrice + depositTotal).toFixed(2)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={processing || rentalDays === 0}
                                    >
                                        {processing ? 'Submitting...' : 'Submit Booking Request'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
