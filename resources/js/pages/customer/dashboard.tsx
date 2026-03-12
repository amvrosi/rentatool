import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, DollarSign, Eye } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Rental, RentalStatus } from '@/types/models';
import { usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/my/dashboard' },
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
    activeRentals: Rental[];
    stats: {
        total_rentals: number;
        active_rentals: number;
        total_spent: number;
    };
}

export default function CustomerDashboard({ activeRentals, stats }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Welcome back, {auth.user.name}!</h1>
                    <Button asChild>
                        <Link href="/equipment">Browse Equipment</Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rentals</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_rentals}</div>
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
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${Number(stats.total_spent).toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Rentals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Rentals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeRentals.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4 text-center">
                                No active rentals. Browse our equipment to get started!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {activeRentals.map((rental) => (
                                    <div
                                        key={rental.id}
                                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-semibold">{rental.equipment?.name ?? 'Equipment'}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={statusColors[rental.status]} variant="secondary">
                                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                                            </Badge>
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/customer/rentals/${rental.id}`}>
                                                    <Eye className="mr-1 h-3 w-3" />
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
