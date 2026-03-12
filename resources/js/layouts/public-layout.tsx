import { Link, router, usePage } from '@inertiajs/react';
import { HardHat, Menu, X } from 'lucide-react';
import { type PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard, home, login, logout, register } from '@/routes';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Equipment', href: '/equipment' },
    { label: 'About', href: '/about' },
];

export default function PublicLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post(logout.url());
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link href={home.url()} className="flex items-center gap-2">
                        <HardHat className="size-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            RentATool
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden items-center gap-2 md:flex">
                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={dashboard.url()}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Dashboard
                                </Link>
                                <span className="text-sm text-gray-500">
                                    {auth.user.name}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={login.url()}>Log in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href={register.url()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileMenuOpen ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-200 bg-white md:hidden">
                        <div className="space-y-1 px-4 py-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 px-4 py-3">
                            {auth.user ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        {auth.user.name}
                                    </p>
                                    <Link
                                        href={dashboard.url()}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        type="button"
                                        className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href={login.url()}>Log in</Link>
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href={register.url()}>Register</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-900 text-gray-300">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-4">
                        {/* Company Info */}
                        <div className="md:col-span-1">
                            <div className="mb-4 flex items-center gap-2">
                                <HardHat className="size-6 text-primary" />
                                <span className="text-lg font-bold text-white">
                                    RentATool
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Your trusted partner for construction equipment
                                rentals. Quality tools, competitive prices, and
                                reliable service.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                                Quick Links
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        href="/"
                                        className="transition-colors hover:text-white"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/equipment"
                                        className="transition-colors hover:text-white"
                                    >
                                        Browse Equipment
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="transition-colors hover:text-white"
                                    >
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                                Services
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>Equipment Rental</li>
                                <li>Operator Services</li>
                                <li>Delivery & Pickup</li>
                                <li>Maintenance Support</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
                                Contact Us
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>1-800-RENT-TOOL</li>
                                <li>info@rentatool.com</li>
                                <li>
                                    123 Construction Ave
                                    <br />
                                    Builder City, ST 12345
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} RentATool. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
