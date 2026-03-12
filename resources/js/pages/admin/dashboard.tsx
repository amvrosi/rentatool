import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, DollarSign, Users, Eye, Plus, Settings } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Rental, RentalStatus } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
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
    stats: {
        total_equipment: number;
        active_rentals: number;
        total_revenue: number;
        total_users: number;
    };
    recentRentals: Rental[];
}

export default function AdminDashboard({ stats, recentRentals }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/admin/equipment/create">
                                <Plus className="mr-1 h-4 w-4" />
                                Add Equipment
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/categories">
                                <Settings className="mr-1 h-4 w-4" />
                                Categories
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipment</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_equipment}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_rentals}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${Number(stats.total_revenue).toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Button asChild variant="outline" className="h-auto py-4">
                        <Link href="/admin/equipment" className="flex flex-col items-center gap-1">
                            <Package className="h-5 w-5" />
                            <span>Manage Equipment</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4">
                        <Link href="/admin/rentals" className="flex flex-col items-center gap-1">
                            <Clock className="h-5 w-5" />
                            <span>Manage Rentals</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4">
                        <Link href="/admin/users" className="flex flex-col items-center gap-1">
                            <Users className="h-5 w-5" />
                            <span>Manage Users</span>
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4">
                        <Link href="/admin/categories" className="flex flex-col items-center gap-1">
                            <Settings className="h-5 w-5" />
                            <span>Manage Categories</span>
                        </Link>
                    </Button>
                </div>

                {/* Recent Rentals */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Rentals</CardTitle>
                        <Button asChild size="sm" variant="outline">
                            <Link href="/admin/rentals">View All</Link>
                        </Button>
                    </CardHeader>
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
                                    {recentRentals.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                No recent rentals.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentRentals.map((rental) => (
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
                            {recentRentals.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No recent rentals.</p>
                            ) : (
                                recentRentals.map((rental) => (
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
