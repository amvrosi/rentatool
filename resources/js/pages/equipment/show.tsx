import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    HardHat,
    Info,
    Shield,
    Star,
    Tag,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { EquipmentCard } from '@/components/public/equipment-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { Equipment, EquipmentImage } from '@/types/models';

interface EquipmentShowProps {
    equipment: Equipment;
    relatedEquipment: Equipment[];
}

function formatCurrency(amount: number | string): string {
    return `$${Number(amount).toFixed(2)}`;
}

export default function EquipmentShow({
    equipment,
    relatedEquipment,
}: EquipmentShowProps) {
    const images = equipment.images ?? [];
    const primaryImage =
        equipment.primary_image ??
        images.find((img) => img.is_primary) ??
        images[0] ??
        null;

    const [selectedImage, setSelectedImage] = useState<EquipmentImage | null>(
        primaryImage,
    );

    const isAvailable =
        equipment.status === 'active' &&
        (equipment.available_quantity === undefined ||
            equipment.available_quantity > 0);

    return (
        <PublicLayout>
            <Head title={equipment.name} />

            {/* Breadcrumb */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-1 text-sm text-gray-500">
                        <Link
                            href="/equipment"
                            className="transition-colors hover:text-primary"
                        >
                            Equipment
                        </Link>
                        <ChevronRight className="size-3.5" />
                        {equipment.category && (
                            <>
                                <Link
                                    href={`/equipment?category=${equipment.category.slug}`}
                                    className="transition-colors hover:text-primary"
                                >
                                    {equipment.category.name}
                                </Link>
                                <ChevronRight className="size-3.5" />
                            </>
                        )}
                        <span className="truncate font-medium text-gray-900">
                            {equipment.name}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/equipment"
                    className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-primary"
                >
                    <ArrowLeft className="size-4" />
                    Back to Equipment
                </Link>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div>
                        {/* Primary Image */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                            {selectedImage ? (
                                <img
                                    src={selectedImage.url}
                                    alt={
                                        selectedImage.alt_text ??
                                        equipment.name
                                    }
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center">
                                    <HardHat className="size-24 text-gray-300" />
                                </div>
                            )}

                            {/* Status Badge */}
                            {!isAvailable && (
                                <Badge
                                    variant="destructive"
                                    className="absolute top-4 right-4"
                                >
                                    {equipment.status === 'maintenance'
                                        ? 'Under Maintenance'
                                        : 'Unavailable'}
                                </Badge>
                            )}

                            {equipment.is_featured && isAvailable && (
                                <Badge className="absolute top-4 left-4">
                                    <Star className="mr-1 size-3" />
                                    Featured
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5">
                                {images.map((image) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedImage(image)
                                        }
                                        className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                                            selectedImage?.id === image.id
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={
                                                image.alt_text ??
                                                equipment.name
                                            }
                                            className="size-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Equipment Details */}
                    <div>
                        {/* Category Badge */}
                        {equipment.category && (
                            <Link
                                href={`/equipment?category=${equipment.category.slug}`}
                            >
                                <Badge
                                    variant="secondary"
                                    className="mb-3 cursor-pointer hover:bg-secondary/80"
                                >
                                    {equipment.category.name}
                                </Badge>
                            </Link>
                        )}

                        {/* Name */}
                        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                            {equipment.name}
                        </h1>

                        {/* SKU & Rating */}
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span>SKU: {equipment.sku}</span>
                            {equipment.average_rating !== undefined &&
                                equipment.average_rating > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Star className="size-4 fill-primary text-primary" />
                                        {equipment.average_rating.toFixed(1)}
                                    </span>
                                )}
                            {equipment.requires_operator && (
                                <Badge variant="outline" className="gap-1">
                                    <Wrench className="size-3" />
                                    Operator Required
                                </Badge>
                            )}
                        </div>

                        {/* Description */}
                        <p className="mb-6 leading-relaxed text-gray-600">
                            {equipment.description}
                        </p>

                        {/* Pricing Table */}
                        <Card className="mb-6 gap-0 py-0 overflow-hidden">
                            <CardHeader className="bg-gray-50 px-4 py-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Tag className="size-4 text-primary" />
                                    Rental Rates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full">
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="size-4 text-gray-400" />
                                                    Daily Rate
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                                                {formatCurrency(
                                                    equipment.daily_rate,
                                                )}
                                                <span className="text-sm font-normal text-gray-500">
                                                    {' '}
                                                    / day
                                                </span>
                                            </td>
                                        </tr>
                                        {equipment.weekly_rate && (
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="size-4 text-gray-400" />
                                                        Weekly Rate
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                                                    {formatCurrency(
                                                        equipment.weekly_rate,
                                                    )}
                                                    <span className="text-sm font-normal text-gray-500">
                                                        {' '}
                                                        / week
                                                    </span>
                                                </td>
                                            </tr>
                                        )}
                                        {equipment.monthly_rate && (
                                            <tr>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                                    <span className="flex items-center gap-2">
                                                        <Calendar className="size-4 text-gray-400" />
                                                        Monthly Rate
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                                                    {formatCurrency(
                                                        equipment.monthly_rate,
                                                    )}
                                                    <span className="text-sm font-normal text-gray-500">
                                                        {' '}
                                                        / month
                                                    </span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        {/* Deposit & Availability Info */}
                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-gray-200 p-3 text-center">
                                <Shield className="mx-auto mb-1 size-5 text-primary" />
                                <p className="text-xs text-gray-500">
                                    Security Deposit
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    {formatCurrency(equipment.deposit_amount)}
                                </p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-3 text-center">
                                <Clock className="mx-auto mb-1 size-5 text-primary" />
                                <p className="text-xs text-gray-500">
                                    Min Rental
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    {equipment.min_rental_days}{' '}
                                    {equipment.min_rental_days === 1
                                        ? 'day'
                                        : 'days'}
                                </p>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mb-6 flex items-center gap-2 rounded-lg border border-gray-200 p-3">
                            <Info className="size-5 shrink-0 text-primary" />
                            <div className="text-sm">
                                {isAvailable ? (
                                    <span className="font-medium text-green-700">
                                        Available for rent
                                        {equipment.available_quantity !==
                                            undefined && (
                                            <span className="font-normal text-gray-500">
                                                {' '}
                                                &mdash;{' '}
                                                {equipment.available_quantity}{' '}
                                                of {equipment.quantity} in stock
                                            </span>
                                        )}
                                    </span>
                                ) : (
                                    <span className="font-medium text-red-600">
                                        Currently unavailable
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Book Now Button */}
                        <Button
                            size="lg"
                            className="w-full text-base"
                            asChild={isAvailable}
                            disabled={!isAvailable}
                        >
                            {isAvailable ? (
                                <Link href={`/booking/${equipment.id}`}>
                                    <Calendar className="mr-2 size-5" />
                                    Book Now
                                </Link>
                            ) : (
                                <span>
                                    Currently Unavailable
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Specifications */}
                {equipment.specifications &&
                    Object.keys(equipment.specifications).length > 0 && (
                        <div className="mt-12">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                                <Wrench className="size-5 text-primary" />
                                Specifications
                            </h2>
                            <Card className="gap-0 py-0 overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-100">
                                        {Object.entries(
                                            equipment.specifications,
                                        ).map(([key, value], index) => (
                                            <div
                                                key={key}
                                                className={`flex items-center justify-between px-4 py-3 text-sm ${
                                                    index % 2 === 0
                                                        ? 'bg-gray-50/50'
                                                        : ''
                                                }`}
                                            >
                                                <span className="font-medium capitalize text-gray-700">
                                                    {key.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-gray-600">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                {/* Features */}
                {equipment.features && equipment.features.length > 0 && (
                    <div className="mt-10">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                            <Check className="size-5 text-primary" />
                            Features
                        </h2>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {equipment.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-2 rounded-md p-2"
                                >
                                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <span className="text-sm text-gray-700">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Equipment */}
                {relatedEquipment.length > 0 && (
                    <div className="mt-16 border-t border-gray-200 pt-12">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                                    Related Equipment
                                </h2>
                                <p className="text-gray-600">
                                    You might also be interested in these items
                                </p>
                            </div>
                            {equipment.category && (
                                <Button
                                    variant="outline"
                                    asChild
                                    className="hidden sm:inline-flex"
                                >
                                    <Link
                                        href={`/equipment?category=${equipment.category.slug}`}
                                    >
                                        View All in{' '}
                                        {equipment.category.name}
                                    </Link>
                                </Button>
                            )}
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedEquipment.slice(0, 3).map((item) => (
                                <EquipmentCard
                                    key={item.id}
                                    equipment={item}
                                />
                            ))}
                        </div>
                        {equipment.category && (
                            <div className="mt-6 text-center sm:hidden">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/equipment?category=${equipment.category.slug}`}
                                    >
                                        View All in{' '}
                                        {equipment.category.name}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
