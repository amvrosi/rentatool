import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    HardHat,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { type FormEvent, useCallback, useRef, useState } from 'react';
import { EquipmentCard } from '@/components/public/equipment-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import type { Equipment, EquipmentCategory, PaginatedData } from '@/types/models';

interface EquipmentIndexProps {
    equipment: PaginatedData<Equipment>;
    categories: EquipmentCategory[];
    filters: {
        search?: string;
        category?: string;
        sort?: string;
    };
}

const sortOptions = [
    { value: 'name_asc', label: 'Name: A-Z' },
    { value: 'name_desc', label: 'Name: Z-A' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function EquipmentIndex({
    equipment,
    categories,
    filters,
}: EquipmentIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search ?? '');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = useCallback(
        (newFilters: Partial<typeof filters>) => {
            const params: Record<string, string> = {};
            const merged = { ...filters, ...newFilters };

            if (merged.search) params.search = merged.search;
            if (merged.category) params.category = merged.category;
            if (merged.sort) params.sort = merged.sort;

            router.get('/equipment', params, { preserveState: true });
        },
        [filters],
    );

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            applyFilters({ search: value || undefined });
        }, 400);
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        applyFilters({ search: searchValue || undefined });
    };

    const handleCategorySelect = (slug: string) => {
        applyFilters({
            category: filters.category === slug ? undefined : slug,
        });
    };

    const handleSortChange = (value: string) => {
        applyFilters({ sort: value === 'default' ? undefined : value });
    };

    const clearFilters = () => {
        setSearchValue('');
        router.get('/equipment', {}, { preserveState: true });
    };

    const hasActiveFilters = filters.search || filters.category || filters.sort;

    const activeCategory = categories.find(
        (c) => c.slug === filters.category,
    );

    return (
        <PublicLayout>
            <Head title="Browse Equipment" />

            {/* Page Header */}
            <section className="border-b border-gray-200 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Browse Equipment
                            </h1>
                            <p className="mt-2 text-gray-600">
                                {equipment.meta.total}{' '}
                                {equipment.meta.total === 1 ? 'item' : 'items'}{' '}
                                available for rent
                            </p>
                        </div>

                        {/* Sort Dropdown - Desktop */}
                        <div className="hidden sm:block">
                            <Select
                                value={filters.sort ?? 'default'}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">
                                        Default
                                    </SelectItem>
                                    {sortOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="mt-6 flex gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search equipment by name, description, or SKU..."
                                value={searchValue}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="pl-10"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        <Button type="submit">
                            <Search className="mr-2 size-4" />
                            Search
                        </Button>
                    </form>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-500">
                                Active filters:
                            </span>
                            {filters.search && (
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setSearchValue('');
                                        applyFilters({ search: undefined });
                                    }}
                                >
                                    Search: "{filters.search}"
                                    <X className="ml-1 size-3" />
                                </Badge>
                            )}
                            {activeCategory && (
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        applyFilters({ category: undefined })
                                    }
                                >
                                    {activeCategory.name}
                                    <X className="ml-1 size-3" />
                                </Badge>
                            )}
                            {filters.sort && (
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        applyFilters({ sort: undefined })
                                    }
                                >
                                    {sortOptions.find(
                                        (o) => o.value === filters.sort,
                                    )?.label ?? filters.sort}
                                    <X className="ml-1 size-3" />
                                </Badge>
                            )}
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
                    {/* Mobile Filter Toggle */}
                    <div className="mb-4 flex items-center gap-2 lg:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="size-4" />
                            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                        </Button>

                        {/* Sort Dropdown - Mobile */}
                        <Select
                            value={filters.sort ?? 'default'}
                            onValueChange={handleSortChange}
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                {sortOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category Sidebar */}
                    <aside
                        className={`mb-6 lg:mb-0 lg:block ${filtersOpen ? 'block' : 'hidden'}`}
                    >
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <Filter className="size-4 text-primary" />
                                <h2 className="font-semibold text-gray-900">
                                    Categories
                                </h2>
                            </div>
                            <nav className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        applyFilters({ category: undefined })
                                    }
                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                        !filters.category
                                            ? 'bg-primary/10 font-medium text-primary'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <HardHat className="size-4" />
                                        All Equipment
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {equipment.meta.total}
                                    </span>
                                </button>
                                {categories.map((category) => (
                                    <button
                                        type="button"
                                        key={category.id}
                                        onClick={() =>
                                            handleCategorySelect(category.slug)
                                        }
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                            filters.category === category.slug
                                                ? 'bg-primary/10 font-medium text-primary'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{category.name}</span>
                                        {typeof category.equipment_count ===
                                            'number' && (
                                            <span className="text-xs text-gray-400">
                                                {category.equipment_count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Equipment Grid */}
                    <div>
                        {equipment.data.length > 0 ? (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {equipment.data.map((item) => (
                                        <EquipmentCard
                                            key={item.id}
                                            equipment={item}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {equipment.meta.last_page > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        {equipment.links.prev ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={equipment.links.prev}
                                                    preserveState
                                                >
                                                    <ChevronLeft className="mr-1 size-4" />
                                                    Previous
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                            >
                                                <ChevronLeft className="mr-1 size-4" />
                                                Previous
                                            </Button>
                                        )}

                                        <span className="px-4 text-sm text-gray-600">
                                            Page {equipment.meta.current_page}{' '}
                                            of {equipment.meta.last_page}
                                        </span>

                                        {equipment.links.next ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={equipment.links.next}
                                                    preserveState
                                                >
                                                    Next
                                                    <ChevronRight className="ml-1 size-4" />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                            >
                                                Next
                                                <ChevronRight className="ml-1 size-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-16 text-center">
                                <HardHat className="mb-4 size-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                    No equipment found
                                </h3>
                                <p className="mb-6 max-w-sm text-sm text-gray-500">
                                    We couldn't find any equipment matching your
                                    filters. Try adjusting your search or
                                    clearing filters.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
