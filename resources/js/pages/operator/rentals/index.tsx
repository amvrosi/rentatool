import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedData, Rental, RentalStatus } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/operator/dashboard' },
    { title: 'My Assignments', href: '/operator/rentals' },
];

const statusColors: Record<RentalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    overdue: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

const statusOptions: { label: string; value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Overdue', value: 'overdue' },
];

interface Props {
    rentals: PaginatedData<Rental>;
    filters: {
        status?: string;
    };
}

export default function OperatorRentalsIndex({ rentals, filters = {} }: Props) {
    function handleStatusFilter(status: string) {
        router.get('/operator/rentals', status ? { status } : {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Assignments" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <h1 className="text-2xl font-bold">My Assignments</h1>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <Button
                            key={option.value}
                            size="sm"
                            variant={(filters.status ?? '') === option.value ? 'default' : 'outline'}
                            onClick={() => handleStatusFilter(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rental #</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Equipment</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dates</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rentals.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No assignments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        rentals.data.map((rental) => (
                                            <tr key={rental.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 font-medium">{rental.rental_number}</td>
                                                <td className="px-4 py-3">{rental.equipment?.name ?? '-'}</td>
                                                <td className="px-4 py-3">{rental.customer?.name ?? '-'}</td>
                                                <td className="px-4 py-3">
                                                    {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusColors[rental.status]} variant="secondary">
                                                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/operator/rentals/${rental.id}`}>View</Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3 p-4">
                            {rentals.data.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No assignments found.</p>
                            ) : (
                                rentals.data.map((rental) => (
                                    <div key={rental.id} className="rounded-lg border p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{rental.rental_number}</span>
                                            <Badge className={statusColors[rental.status]} variant="secondary">
                                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm">{rental.equipment?.name ?? '-'}</p>
                                        <p className="text-sm text-muted-foreground">{rental.customer?.name ?? '-'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                        </p>
                                        <div className="flex justify-end">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/operator/rentals/${rental.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {rentals.meta?.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3">
                                <p className="text-sm text-muted-foreground">
                                    Showing {rentals.meta?.from} to {rentals.meta?.to} of {rentals.meta?.total} assignments
                                </p>
                                <div className="flex gap-2">
                                    {rentals.links.prev && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={rentals.links.prev}>Previous</Link>
                                        </Button>
                                    )}
                                    {rentals.links.next && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={rentals.links.next}>Next</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
