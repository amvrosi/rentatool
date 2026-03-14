import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Clock, User as UserIcon, Package, MapPin } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Rental, RentalStatus } from '@/types/models';
import type { User } from '@/types/auth';
import { type FormEvent } from 'react';

const statusColors: Record<RentalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    overdue: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const allStatuses: RentalStatus[] = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'overdue'];

interface Props {
    rental: Rental;
    operators: User[];
}

export default function RentalShow({ rental, operators }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Rentals', href: '/admin/rentals' },
        { title: rental.rental_number, href: `/admin/rentals/${rental.id}` },
    ];

    const statusForm = useForm({
        status: rental.status as string,
    });

    const operatorForm = useForm({
        operator_id: rental.operator_id ? String(rental.operator_id) : '',
    });

    const notesForm = useForm({
        admin_notes: rental.admin_notes ?? '',
    });

    function handleStatusUpdate(e: FormEvent) {
        e.preventDefault();
        statusForm.put(`/admin/rentals/${rental.id}/status`);
    }

    function handleOperatorUpdate(e: FormEvent) {
        e.preventDefault();
        operatorForm.put(`/admin/rentals/${rental.id}/operator`);
    }

    function handleNotesUpdate(e: FormEvent) {
        e.preventDefault();
        notesForm.put(`/admin/rentals/${rental.id}/notes`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rental ${rental.rental_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/rentals">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Rental {rental.rental_number}</h1>
                        <Badge className={statusColors[rental.status]} variant="secondary">
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Rental Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Rental Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Rental Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Equipment</p>
                                        <p className="font-medium">{rental.equipment?.name ?? '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Quantity</p>
                                        <p className="font-medium">{rental.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="font-medium">{new Date(rental.start_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">End Date</p>
                                        <p className="font-medium">{new Date(rental.end_date).toLocaleDateString()}</p>
                                    </div>
                                    {rental.actual_return_date && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Actual Return Date</p>
                                            <p className="font-medium">{new Date(rental.actual_return_date).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-muted-foreground">Daily Rate</p>
                                        <p className="font-medium">${Number(rental.daily_rate_snapshot).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Price</p>
                                        <p className="text-lg font-bold">${Number(rental.total_price).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Deposit</p>
                                        <p className="font-medium">${Number(rental.deposit_amount).toFixed(2)}</p>
                                    </div>
                                </div>
                                {rental.delivery_address && (
                                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Delivery Address</p>
                                            <p className="font-medium">{rental.delivery_address}</p>
                                        </div>
                                    </div>
                                )}
                                {rental.notes && (
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">Customer Notes</p>
                                        <p className="mt-1 text-sm">{rental.notes}</p>
                                    </div>
                                )}
                                {rental.cancellation_reason && (
                                    <div className="mt-4 rounded-lg bg-destructive/10 p-3">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-400">Cancellation Reason</p>
                                        <p className="mt-1 text-sm text-destructive">{rental.cancellation_reason}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-medium">{rental.customer?.name ?? '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{rental.customer?.email ?? '-'}</p>
                                    </div>
                                    {rental.customer?.phone && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium">{rental.customer.phone}</p>
                                        </div>
                                    )}
                                    {rental.customer?.company_name && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Company</p>
                                            <p className="font-medium">{rental.customer.company_name}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status History Timeline */}
                        {rental.status_history && rental.status_history.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Status History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative space-y-0">
                                        {rental.status_history.map((entry, index) => (
                                            <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                                                {index < rental.status_history!.length - 1 && (
                                                    <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
                                                )}
                                                <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-background" />
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {entry.from_status && (
                                                            <>
                                                                <Badge className={statusColors[entry.from_status]} variant="secondary">
                                                                    {entry.from_status.charAt(0).toUpperCase() + entry.from_status.slice(1)}
                                                                </Badge>
                                                                <span className="text-muted-foreground">&rarr;</span>
                                                            </>
                                                        )}
                                                        <Badge className={statusColors[entry.to_status]} variant="secondary">
                                                            {entry.to_status.charAt(0).toUpperCase() + entry.to_status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {entry.user?.name ?? 'System'} &middot; {new Date(entry.created_at).toLocaleString()}
                                                    </p>
                                                    {entry.notes && (
                                                        <p className="mt-1 text-sm text-muted-foreground">{entry.notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Update Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleStatusUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            value={statusForm.data.status}
                                            onValueChange={(value) => statusForm.setData('status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allStatuses.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {statusForm.errors.status && (
                                            <p className="text-sm text-destructive">{statusForm.errors.status}</p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={statusForm.processing || statusForm.data.status === rental.status}
                                    >
                                        {statusForm.processing ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Assign Operator */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Assign Operator</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleOperatorUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="operator_id">Operator</Label>
                                        <Select
                                            value={operatorForm.data.operator_id}
                                            onValueChange={(value) => operatorForm.setData('operator_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an operator" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Operator</SelectItem>
                                                {operators.map((op) => (
                                                    <SelectItem key={op.id} value={String(op.id)}>
                                                        {op.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {operatorForm.errors.operator_id && (
                                            <p className="text-sm text-destructive">{operatorForm.errors.operator_id}</p>
                                        )}
                                    </div>
                                    {rental.operator && (
                                        <p className="text-sm text-muted-foreground">
                                            Currently assigned: {rental.operator.name}
                                        </p>
                                    )}
                                    <Button type="submit" variant="outline" className="w-full" disabled={operatorForm.processing}>
                                        {operatorForm.processing ? 'Updating...' : 'Update Operator'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Admin Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleNotesUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="admin_notes">Notes</Label>
                                        <textarea
                                            id="admin_notes"
                                            rows={4}
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={notesForm.data.admin_notes}
                                            onChange={(e) => notesForm.setData('admin_notes', e.target.value)}
                                            placeholder="Add internal notes about this rental..."
                                        />
                                        {notesForm.errors.admin_notes && (
                                            <p className="text-sm text-destructive">{notesForm.errors.admin_notes}</p>
                                        )}
                                    </div>
                                    <Button type="submit" variant="outline" className="w-full" disabled={notesForm.processing}>
                                        {notesForm.processing ? 'Saving...' : 'Save Notes'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Equipment Info Card */}
                        {rental.equipment && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Equipment Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-medium">{rental.equipment.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">SKU</p>
                                        <p className="font-medium">{rental.equipment.sku}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Category</p>
                                        <p className="font-medium">{rental.equipment.category?.name ?? '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Daily Rate</p>
                                        <p className="font-medium">${Number(rental.equipment.daily_rate).toFixed(2)}</p>
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                                        <Link href={`/admin/equipment/${rental.equipment.id}/edit`}>
                                            View Equipment
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
