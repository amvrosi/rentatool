import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedData, Rental, RentalStatus } from '@/types/models';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Rentals', href: '/admin/rentals' },
];

const statusColors: Record<RentalStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    overdue: 'bg-orange-100 text-orange-800',
};

interface Props {
    rentals: PaginatedData<Rental>;
    filters: {
        status?: string;
        search?: string;
    };
}

export default function RentalsIndex({ rentals, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Record<string, string>) {
        router.get('/admin/rentals', {
            ...filters,
            ...newFilters,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilters({ search });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Rentals" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <h1 className="text-2xl font-bold">Rentals</h1>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by rental #, customer, or equipment..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Search</Button>
                    </form>
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(value) => applyFilters({ status: value === 'all' ? '' : value })}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rentals Table */}
                <Card>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rental #</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
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
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                No rentals found.
                                            </td>
                                        </tr>
                                    ) : (
                                        rentals.data.map((rental) => (
                                            <tr key={rental.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 font-medium">{rental.rental_number}</td>
                                                <td className="px-4 py-3">{rental.customer?.name ?? '-'}</td>
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
                                                        <Link href={`/admin/rentals/${rental.id}`}>
                                                            <Eye className="mr-1 h-3 w-3" />
                                                            View
                                                        </Link>
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
                                        <p className="text-sm">{rental.customer?.name ?? '-'}</p>
                                        <p className="text-sm text-muted-foreground">{rental.equipment?.name ?? '-'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">${Number(rental.total_price).toFixed(2)}</span>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/admin/rentals/${rental.id}`}>
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    View
                                                </Link>
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
