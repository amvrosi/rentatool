import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    DollarSign,
    Headphones,
    HardHat,
    Layers,
} from 'lucide-react';
import { EquipmentCard } from '@/components/public/equipment-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import type { Equipment, EquipmentCategory } from '@/types/models';

interface WelcomeProps {
    featuredEquipment: Equipment[];
    categories: EquipmentCategory[];
}

const iconMap: Record<string, React.ElementType> = {
    hardhat: HardHat,
    layers: Layers,
};

const valueProps = [
    {
        icon: Layers,
        title: 'Wide Selection',
        description:
            'From compact hand tools to heavy machinery, we have everything you need for any construction project.',
    },
    {
        icon: CheckCircle,
        title: 'Reliable Equipment',
        description:
            'Every piece of equipment is regularly inspected, maintained, and tested to ensure peak performance on your job site.',
    },
    {
        icon: DollarSign,
        title: 'Flexible Pricing',
        description:
            'Choose from daily, weekly, or monthly rates. We offer competitive pricing that fits your project timeline and budget.',
    },
    {
        icon: Headphones,
        title: 'Expert Support',
        description:
            'Our team of experienced professionals is available to help you select the right equipment and provide on-site support.',
    },
];

export default function Welcome({
    featuredEquipment = [],
    categories = [],
}: WelcomeProps) {
    return (
        <PublicLayout>
            <Head title="Rent Construction Equipment" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.7),rgba(0,0,0,0.4))]" />
                <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
                    <div className="max-w-2xl">
                        <Badge variant="secondary" className="mb-4 text-sm">
                            <HardHat className="mr-1 size-4" />
                            Trusted by professionals
                        </Badge>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Rent Construction Equipment
                        </h1>
                        <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300">
                            Get reliable, well-maintained construction equipment
                            delivered to your job site. Daily, weekly, and monthly
                            rental options to fit any project.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" asChild>
                                <Link href="/equipment">Browse Equipment</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-gray-900">
                                <Link href="/about">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Cards */}
            {categories.length > 0 && (
                <section className="bg-muted py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 text-center">
                            <h2 className="mb-3 text-3xl font-bold text-foreground">
                                Equipment Categories
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Find the right equipment for your project
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {categories.map((category) => {
                                const IconComponent =
                                    category.icon && iconMap[category.icon]
                                        ? iconMap[category.icon]
                                        : HardHat;
                                return (
                                    <Link
                                        key={category.id}
                                        href={`/equipment?category=${category.slug}`}
                                    >
                                        <Card className="group cursor-pointer gap-0 py-0 transition-all hover:shadow-md hover:-translate-y-0.5">
                                            <CardContent className="flex items-center gap-4 p-5">
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                                                    <IconComponent className="size-6 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate font-semibold text-foreground">
                                                        {category.name}
                                                    </h3>
                                                    {typeof category.equipment_count === 'number' && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {category.equipment_count}{' '}
                                                            {category.equipment_count === 1
                                                                ? 'item'
                                                                : 'items'}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Equipment */}
            {featuredEquipment.length > 0 && (
                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-10 flex items-end justify-between">
                            <div>
                                <h2 className="mb-3 text-3xl font-bold text-foreground">
                                    Featured Equipment
                                </h2>
                                <p className="text-lg text-muted-foreground">
                                    Popular rentals chosen by professionals
                                </p>
                            </div>
                            <Button variant="outline" asChild className="hidden sm:inline-flex">
                                <Link href="/equipment">View All</Link>
                            </Button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredEquipment.slice(0, 6).map((item) => (
                                <EquipmentCard key={item.id} equipment={item} />
                            ))}
                        </div>
                        <div className="mt-8 text-center sm:hidden">
                            <Button variant="outline" asChild>
                                <Link href="/equipment">View All Equipment</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            <section className="bg-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-foreground">
                            Why Choose RentATool
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We make renting construction equipment simple and
                            reliable
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {valueProps.map((prop) => (
                            <div
                                key={prop.title}
                                className="text-center"
                            >
                                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                                    <prop.icon className="size-7 text-primary" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-foreground">
                                    {prop.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {prop.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-primary py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
                        Ready to Get Started?
                    </h2>
                    <p className="mb-8 text-lg text-primary-foreground">
                        Browse our full catalog and find the equipment you need
                        for your next project.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            size="lg"
                            variant="secondary"
                            asChild
                        >
                            <Link href="/equipment">Browse Equipment</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                        >
                            <Link href="/about">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
