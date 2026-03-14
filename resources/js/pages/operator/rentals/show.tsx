import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';
import type { Rental, RentalStatus } from '@/types/models';

const statusColors: Record<RentalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    overdue: 'bg-orange-100 text-orange-800',
};

interface Props {
    rental: Rental;
}

export default function OperatorRentalShow({ rental }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/operator/dashboard' },
        { title: 'My Assignments', href: '/operator/rentals' },
        { title: rental.rental_number, href: '#' },
    ];

    const canMarkActive = rental.status === 'confirmed';
    const canMarkCompleted = rental.status === 'active';

    function handleStatusUpdate(status: RentalStatus) {
        const messages: Record<string, string> = {
            active: 'Mark this rental as active (equipment delivered)?',
            completed: 'Mark this rental as completed (equipment returned)?',
        };

        if (confirm(messages[status] ?? `Update status to ${status}?`)) {
            router.put(`/operator/rentals/${rental.id}/status`, { status });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rental ${rental.rental_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Rental {rental.rental_number}</h1>
                        <Badge className={statusColors[rental.status]} variant="secondary">
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        {canMarkActive && (
                            <Button onClick={() => handleStatusUpdate('active')}>
                                Mark as Active
                            </Button>
                        )}
                        {canMarkCompleted && (
                            <Button onClick={() => handleStatusUpdate('completed')}>
                                Mark as Completed
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Equipment Info */}
                    {rental.equipment && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Equipment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-start gap-4">
                                    {rental.equipment.primary_image && (
                                        <img
                                            src={rental.equipment.primary_image.url}
                                            alt={rental.equipment.name}
                                            className="h-24 w-24 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold text-lg">{rental.equipment.name}</p>
                                        <p className="text-muted-foreground text-sm">SKU: {rental.equipment.sku}</p>
                                        {rental.equipment.category && (
                                            <p className="text-muted-foreground text-sm">{rental.equipment.category.name}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Customer Info */}
                    {rental.customer && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Name</span>
                                    <span>{rental.customer.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email</span>
                                    <span>{rental.customer.email}</span>
                                </div>
                                {rental.customer.phone && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Phone</span>
                                        <span>{rental.customer.phone}</span>
                                    </div>
                                )}
                                {rental.customer.company_name && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Company</span>
                                        <span>{rental.customer.company_name}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Rental Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rental Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Start Date</span>
                                <span>{new Date(rental.start_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">End Date</span>
                                <span>{new Date(rental.end_date).toLocaleDateString()}</span>
                            </div>
                            {rental.actual_return_date && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Actual Return</span>
                                    <span>{new Date(rental.actual_return_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Quantity</span>
                                <span>{rental.quantity}</span>
                            </div>
                            {rental.delivery_address && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Address</span>
                                    <span className="text-right max-w-[200px]">{rental.delivery_address}</span>
                                </div>
                            )}
                            {rental.notes && (
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">Notes</p>
                                    <p className="text-sm mt-1">{rental.notes}</p>
                                </div>
                            )}
                            {rental.admin_notes && (
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">Admin Notes</p>
                                    <p className="text-sm mt-1">{rental.admin_notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status History */}
                    {rental.status_history && rental.status_history.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Status History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-4">
                                    {rental.status_history.map((history, index) => (
                                        <div key={history.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="h-3 w-3 rounded-full bg-primary" />
                                                {index < rental.status_history!.length - 1 && (
                                                    <div className="h-full w-px bg-border" />
                                                )}
                                            </div>
                                            <div className="pb-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={statusColors[history.to_status]} variant="secondary">
                                                        {history.to_status.charAt(0).toUpperCase() + history.to_status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(history.created_at).toLocaleString()}
                                                    {history.user && ` by ${history.user.name}`}
                                                </p>
                                                {history.notes && (
                                                    <p className="text-sm mt-1">{history.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
