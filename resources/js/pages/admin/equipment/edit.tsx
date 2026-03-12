import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Equipment, EquipmentCategory } from '@/types/models';
import { type FormEvent } from 'react';

interface Props {
    equipment: Equipment;
    categories: EquipmentCategory[];
}

export default function EquipmentEdit({ equipment, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Equipment', href: '/admin/equipment' },
        { title: equipment.name, href: `/admin/equipment/${equipment.id}/edit` },
    ];

    const initialSpecs = equipment.specifications
        ? Object.entries(equipment.specifications).map(([key, value]) => ({ key, value }))
        : [{ key: '', value: '' }];

    const initialFeatures = equipment.features?.length ? equipment.features : [''];

    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        category_id: string;
        description: string;
        short_description: string;
        sku: string;
        daily_rate: string;
        weekly_rate: string;
        monthly_rate: string;
        deposit_amount: string;
        quantity: string;
        status: string;
        is_featured: boolean;
        requires_operator: boolean;
        min_rental_days: string;
        max_rental_days: string;
        specifications: { key: string; value: string }[];
        features: string[];
    }>({
        name: equipment.name,
        category_id: String(equipment.category_id),
        description: equipment.description,
        short_description: equipment.short_description ?? '',
        sku: equipment.sku,
        daily_rate: String(equipment.daily_rate),
        weekly_rate: equipment.weekly_rate != null ? String(equipment.weekly_rate) : '',
        monthly_rate: equipment.monthly_rate != null ? String(equipment.monthly_rate) : '',
        deposit_amount: String(equipment.deposit_amount),
        quantity: String(equipment.quantity),
        status: equipment.status,
        is_featured: equipment.is_featured,
        requires_operator: equipment.requires_operator,
        min_rental_days: String(equipment.min_rental_days),
        max_rental_days: equipment.max_rental_days != null ? String(equipment.max_rental_days) : '',
        specifications: initialSpecs,
        features: initialFeatures,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put(`/admin/equipment/${equipment.id}`);
    }

    function addSpecification() {
        setData('specifications', [...data.specifications, { key: '', value: '' }]);
    }

    function removeSpecification(index: number) {
        setData('specifications', data.specifications.filter((_, i) => i !== index));
    }

    function updateSpecification(index: number, field: 'key' | 'value', value: string) {
        const updated = [...data.specifications];
        updated[index][field] = value;
        setData('specifications', updated);
    }

    function addFeature() {
        setData('features', [...data.features, '']);
    }

    function removeFeature(index: number) {
        setData('features', data.features.filter((_, i) => i !== index));
    }

    function updateFeature(index: number, value: string) {
        const updated = [...data.features];
        updated[index] = value;
        setData('features', updated);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${equipment.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/equipment">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Equipment</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
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
                                    <Label htmlFor="sku">SKU *</Label>
                                    <Input
                                        id="sku"
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                    />
                                    {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category *</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-sm text-red-600">{errors.category_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="retired">Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">Short Description</Label>
                                <Input
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                />
                                {errors.short_description && <p className="text-sm text-red-600">{errors.short_description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="daily_rate">Daily Rate ($) *</Label>
                                    <Input
                                        id="daily_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.daily_rate}
                                        onChange={(e) => setData('daily_rate', e.target.value)}
                                    />
                                    {errors.daily_rate && <p className="text-sm text-red-600">{errors.daily_rate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weekly_rate">Weekly Rate ($)</Label>
                                    <Input
                                        id="weekly_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.weekly_rate}
                                        onChange={(e) => setData('weekly_rate', e.target.value)}
                                    />
                                    {errors.weekly_rate && <p className="text-sm text-red-600">{errors.weekly_rate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="monthly_rate">Monthly Rate ($)</Label>
                                    <Input
                                        id="monthly_rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.monthly_rate}
                                        onChange={(e) => setData('monthly_rate', e.target.value)}
                                    />
                                    {errors.monthly_rate && <p className="text-sm text-red-600">{errors.monthly_rate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deposit_amount">Deposit Amount ($) *</Label>
                                    <Input
                                        id="deposit_amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.deposit_amount}
                                        onChange={(e) => setData('deposit_amount', e.target.value)}
                                    />
                                    {errors.deposit_amount && <p className="text-sm text-red-600">{errors.deposit_amount}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory & Rental Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory & Rental Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="0"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                    />
                                    {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min_rental_days">Min Rental Days</Label>
                                    <Input
                                        id="min_rental_days"
                                        type="number"
                                        min="1"
                                        value={data.min_rental_days}
                                        onChange={(e) => setData('min_rental_days', e.target.value)}
                                    />
                                    {errors.min_rental_days && <p className="text-sm text-red-600">{errors.min_rental_days}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_rental_days">Max Rental Days</Label>
                                    <Input
                                        id="max_rental_days"
                                        type="number"
                                        min="1"
                                        value={data.max_rental_days}
                                        onChange={(e) => setData('max_rental_days', e.target.value)}
                                    />
                                    {errors.max_rental_days && <p className="text-sm text-red-600">{errors.max_rental_days}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData('is_featured', checked === true)}
                                    />
                                    <Label htmlFor="is_featured" className="cursor-pointer">Featured Equipment</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requires_operator"
                                        checked={data.requires_operator}
                                        onCheckedChange={(checked) => setData('requires_operator', checked === true)}
                                    />
                                    <Label htmlFor="requires_operator" className="cursor-pointer">Requires Operator</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Specifications</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                                <Plus className="mr-1 h-3 w-3" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.specifications.map((spec, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Key (e.g. Weight)"
                                            value={spec.key}
                                            onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Value (e.g. 500 lbs)"
                                            value={spec.value}
                                            onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                                        />
                                    </div>
                                    {data.specifications.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeSpecification(index)}
                                            className="shrink-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {errors.specifications && <p className="text-sm text-red-600">{errors.specifications}</p>}
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Features</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                <Plus className="mr-1 h-3 w-3" />
                                Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Feature description"
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                        />
                                    </div>
                                    {data.features.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeFeature(index)}
                                            className="shrink-0"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {errors.features && <p className="text-sm text-red-600">{errors.features}</p>}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Button asChild variant="outline">
                            <Link href="/admin/equipment">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Equipment'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
