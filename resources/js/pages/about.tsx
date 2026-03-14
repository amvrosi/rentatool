import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    HardHat,
    Headphones,
    MapPin,
    Phone,
    Mail,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';

const stats = [
    { label: 'Years in Business', value: '15+' },
    { label: 'Equipment Units', value: '500+' },
    { label: 'Happy Customers', value: '2,000+' },
    { label: 'Projects Supported', value: '10,000+' },
];

const values = [
    {
        icon: Shield,
        title: 'Safety First',
        description:
            'Every piece of equipment undergoes rigorous inspection and maintenance to ensure safe operation on your job site.',
    },
    {
        icon: CheckCircle,
        title: 'Quality Guaranteed',
        description:
            'We maintain our fleet to the highest standards, replacing equipment regularly to provide reliable performance.',
    },
    {
        icon: Clock,
        title: 'On-Time Delivery',
        description:
            'We understand deadlines matter. Our logistics team ensures your equipment arrives when and where you need it.',
    },
    {
        icon: Headphones,
        title: 'Expert Support',
        description:
            'Our knowledgeable team is available to help you choose the right equipment and provide technical assistance.',
    },
];

export default function About() {
    return (
        <PublicLayout>
            <Head title="About Us" />

            {/* Hero */}
            <section className="bg-muted">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <div className="max-w-3xl">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            About RentATool
                        </h1>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            We are a trusted equipment rental company dedicated to
                            providing construction professionals with reliable,
                            well-maintained tools and machinery for projects of any
                            scale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-b border-border">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl font-bold text-primary">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-foreground">
                            Our Values
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            What sets us apart in the equipment rental industry
                        </p>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value) => (
                            <Card key={value.title} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                                        <value.icon className="size-7 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {value.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-muted py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-foreground">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Have questions? Our team is here to help.
                        </p>
                    </div>
                    <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
                        <Card>
                            <CardContent className="flex flex-col items-center pt-6 text-center">
                                <Phone className="mb-3 size-6 text-primary" />
                                <p className="font-medium text-foreground">Phone</p>
                                <p className="text-sm text-muted-foreground">
                                    1-800-RENT-TOOL
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col items-center pt-6 text-center">
                                <Mail className="mb-3 size-6 text-primary" />
                                <p className="font-medium text-foreground">Email</p>
                                <p className="text-sm text-muted-foreground">
                                    info@rentatool.com
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col items-center pt-6 text-center">
                                <MapPin className="mb-3 size-6 text-primary" />
                                <p className="font-medium text-foreground">Address</p>
                                <p className="text-sm text-muted-foreground">
                                    123 Construction Ave
                                    <br />
                                    Builder City, ST 12345
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary py-16 sm:py-20">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <HardHat className="mx-auto mb-4 size-12 text-primary-foreground" />
                    <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
                        Ready to Rent?
                    </h2>
                    <p className="mb-8 text-lg text-primary-foreground">
                        Browse our full catalog and find the right equipment for
                        your next project.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/equipment">Browse Equipment</Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
