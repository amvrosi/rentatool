import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Equipment, EquipmentCategory, EquipmentStatus, PaginatedData } from '@/types/models';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Equipment', href: '/admin/equipment' },
];

const equipmentStatusColors: Record<EquipmentStatus, string> = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
};

interface Props {
    equipment: PaginatedData<Equipment>;
    categories: EquipmentCategory[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function EquipmentIndex({ equipment, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Record<string, string>) {
        router.get('/admin/equipment', {
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

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this equipment?')) {
            router.delete(`/admin/equipment/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Equipment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Equipment</h1>
                    <Button asChild>
                        <Link href="/admin/equipment/create">
                            <Plus className="mr-1 h-4 w-4" />
                            Add Equipment
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search equipment..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline">Search</Button>
                    </form>
                    <Select
                        value={filters.category ?? 'all'}
                        onValueChange={(value) => applyFilters({ category: value === 'all' ? '' : value })}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(value) => applyFilters({ status: value === 'all' ? '' : value })}
                    >
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Equipment Table */}
                <Card>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Daily Rate</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Qty</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                                No equipment found.
                                            </td>
                                        </tr>
                                    ) : (
                                        equipment.data.map((item) => (
                                            <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <span className="font-medium">{item.name}</span>
                                                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">{item.category?.name ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">${Number(item.daily_rate).toFixed(2)}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={equipmentStatusColors[item.status]} variant="secondary">
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/admin/equipment/${item.id}/edit`}>
                                                                <Pencil className="mr-1 h-3 w-3" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="mr-1 h-3 w-3" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3 p-4">
                            {equipment.data.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No equipment found.</p>
                            ) : (
                                equipment.data.map((item) => (
                                    <div key={item.id} className="rounded-lg border p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{item.name}</span>
                                            <Badge className={equipmentStatusColors[item.status]} variant="secondary">
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                        <p className="text-sm text-muted-foreground">{item.category?.name ?? '-'}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold">${Number(item.daily_rate).toFixed(2)}/day</span>
                                                <span className="text-sm text-muted-foreground ml-2">Qty: {item.quantity}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/admin/equipment/${item.id}/edit`}>
                                                        <Pencil className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {equipment.meta.last_page > 1 && (
                            <div className="flex items-center justify-between border-t px-4 py-3">
                                <p className="text-sm text-muted-foreground">
                                    Showing {equipment.meta.from} to {equipment.meta.to} of {equipment.meta.total} items
                                </p>
                                <div className="flex gap-2">
                                    {equipment.links.prev && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={equipment.links.prev}>Previous</Link>
                                        </Button>
                                    )}
                                    {equipment.links.next && (
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={equipment.links.next}>Next</Link>
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
