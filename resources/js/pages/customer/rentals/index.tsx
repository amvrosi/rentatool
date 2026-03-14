import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedData, Rental, RentalStatus } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/my/dashboard' },
    { title: 'Rentals', href: '/my/rentals' },
];

const statusColors: Record<RentalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    overdue: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

interface Props {
    rentals: PaginatedData<Rental>;
}

export default function CustomerRentalsIndex({ rentals }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Rentals" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <h1 className="text-2xl font-bold">My Rentals</h1>

                <Card>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rental #</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Equipment</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dates</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rentals.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No rentals found.
                                            </td>
                                        </tr>
                                    ) : (
                                        rentals.data.map((rental) => (
                                            <tr key={rental.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 font-medium">{rental.rental_number}</td>
                                                <td className="px-4 py-3">{rental.equipment?.name ?? '-'}</td>
                                                <td className="px-4 py-3">
                                                    {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusColors[rental.status]} variant="secondary">
                                                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">${Number(rental.total_price).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/my/rentals/${rental.id}`}>View</Link>
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
                                <p className="text-center text-muted-foreground py-4">No rentals found.</p>
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
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">${Number(rental.total_price).toFixed(2)}</span>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/my/rentals/${rental.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {rentals.meta.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3">
                                <p className="text-sm text-muted-foreground">
                                    Showing {rentals.meta.from} to {rentals.meta.to} of {rentals.meta.total} rentals
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
