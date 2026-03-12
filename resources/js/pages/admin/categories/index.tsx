import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { EquipmentCategory } from '@/types/models';
import { useState, type FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

interface Props {
    categories: EquipmentCategory[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<EquipmentCategory | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        slug: '',
        description: '',
        is_active: true,
    });

    function openCreate() {
        setEditingCategory(null);
        reset();
        setDialogOpen(true);
    }

    function openEdit(category: EquipmentCategory) {
        setEditingCategory(category);
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description ?? '',
            is_active: category.is_active,
        });
        setDialogOpen(true);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                },
            });
        }
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Categories" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate}>
                                <Plus className="mr-1 h-4 w-4" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
                                    <DialogDescription>
                                        {editingCategory
                                            ? 'Update the category details below.'
                                            : 'Fill in the details to create a new category.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug *</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                        />
                                        {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked === true)}
                                        />
                                        <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : editingCategory
                                                ? 'Update Category'
                                                : 'Create Category'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Equipment Count</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No categories found.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr key={category.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 font-medium">{category.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                                                <td className="px-4 py-3 text-right">{category.equipment_count ?? 0}</td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                                        variant="secondary"
                                                    >
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEdit(category)}
                                                        >
                                                            <Pencil className="mr-1 h-3 w-3" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleDelete(category.id)}
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
                            {categories.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No categories found.</p>
                            ) : (
                                categories.map((category) => (
                                    <div key={category.id} className="rounded-lg border p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{category.name}</span>
                                            <Badge
                                                className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                                variant="secondary"
                                            >
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {category.equipment_count ?? 0} equipment items
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEdit(category)}
                                                >
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
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
