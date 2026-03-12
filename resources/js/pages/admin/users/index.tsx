import { Head, Link, router } from '@inertiajs/react';
import { Search, Users as UsersIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types/auth';
import type { PaginatedData } from '@/types/models';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    customer: 'bg-blue-100 text-blue-800',
    operator: 'bg-green-100 text-green-800',
};

interface UserWithCount extends User {
    rentals_count?: number;
}

interface Props {
    users: PaginatedData<UserWithCount>;
    filters: {
        role?: string;
        search?: string;
    };
}

export default function AdminUsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleFilter(params: Record<string, string | undefined>) {
        router.get('/admin/users', { ...filters, ...params, page: undefined }, { preserveState: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        handleFilter({ search: search || undefined });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{users.meta.total} total users</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>
                    <Select
                        value={filters.role ?? 'all'}
                        onValueChange={(value) => handleFilter({ role: value === 'all' ? undefined : value })}
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Rentals</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 font-medium">{user.name}</td>
                                                <td className="px-4 py-3">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={roleColors[user.role] ?? ''} variant="secondary">
                                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">{user.company_name ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">{user.rentals_count ?? 0}</td>
                                                <td className="px-4 py-3">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="space-y-3 p-4 md:hidden">
                            {users.data.length === 0 ? (
                                <p className="py-4 text-center text-muted-foreground">No users found.</p>
                            ) : (
                                users.data.map((user) => (
                                    <div key={user.id} className="space-y-2 rounded-lg border p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{user.name}</span>
                                            <Badge className={roleColors[user.role] ?? ''} variant="secondary">
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        {user.company_name && (
                                            <p className="text-sm">{user.company_name}</p>
                                        )}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {user.rentals_count ?? 0} rentals
                                            </span>
                                            <span className="text-muted-foreground">
                                                Joined {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {users.meta.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3">
                                <p className="text-sm text-muted-foreground">
                                    Showing {users.meta.from} to {users.meta.to} of {users.meta.total}
                                </p>
                                <div className="flex gap-2">
                                    {users.links.prev && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={users.links.prev}>Previous</Link>
                                        </Button>
                                    )}
                                    {users.links.next && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={users.links.next}>Next</Link>
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
