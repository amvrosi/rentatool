import { Link } from '@inertiajs/react';
import { HardHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Equipment } from '@/types/models';

interface EquipmentCardProps {
    equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
    const imageUrl = equipment.primary_image?.url ?? equipment.images?.[0]?.url;

    return (
        <Card className="group gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
            {/* Image */}
            <Link href={`/equipment/${equipment.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={equipment.primary_image?.alt_text ?? equipment.name}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center bg-gray-50">
                            <HardHat className="size-16 text-gray-300" />
                        </div>
                    )}
                    {equipment.is_featured && (
                        <Badge className="absolute top-3 left-3">
                            Featured
                        </Badge>
                    )}
                </div>
            </Link>

            {/* Content */}
            <CardContent className="flex flex-1 flex-col gap-2 p-4">
                {/* Category Badge */}
                {equipment.category && (
                    <Badge variant="secondary" className="self-start">
                        {equipment.category.name}
                    </Badge>
                )}

                {/* Name */}
                <Link href={`/equipment/${equipment.slug}`}>
                    <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-primary">
                        {equipment.name}
                    </h3>
                </Link>

                {/* Short Description */}
                {equipment.short_description && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                        {equipment.short_description}
                    </p>
                )}

                {/* Price */}
                <div className="mt-auto pt-2">
                    <span className="text-lg font-bold text-gray-900">
                        ${equipment.daily_rate.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500"> / day</span>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t p-4">
                <Button asChild className="w-full" size="sm">
                    <Link href={`/equipment/${equipment.slug}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
