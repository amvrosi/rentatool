import { User } from './auth';

export type EquipmentCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    image: string | null;
    parent_id: number | null;
    sort_order: number;
    is_active: boolean;
    children?: EquipmentCategory[];
    equipment_count?: number;
    created_at: string;
    updated_at: string;
};

export type EquipmentImage = {
    id: number;
    equipment_id: number;
    path: string;
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
};

export type EquipmentStatus = 'active' | 'maintenance' | 'retired';

export type Equipment = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    sku: string;
    daily_rate: number;
    weekly_rate: number | null;
    monthly_rate: number | null;
    deposit_amount: number;
    quantity: number;
    available_quantity?: number;
    status: EquipmentStatus;
    specifications: Record<string, string> | null;
    features: string[] | null;
    is_featured: boolean;
    requires_operator: boolean;
    min_rental_days: number;
    max_rental_days: number | null;
    category?: EquipmentCategory;
    images?: EquipmentImage[];
    primary_image?: EquipmentImage | null;
    average_rating?: number;
    created_at: string;
    updated_at: string;
};

export type RentalStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue';

export type Rental = {
    id: number;
    rental_number: string;
    customer_id: number;
    equipment_id: number;
    operator_id: number | null;
    quantity: number;
    start_date: string;
    end_date: string;
    actual_return_date: string | null;
    daily_rate_snapshot: number;
    total_price: number;
    deposit_amount: number;
    status: RentalStatus;
    notes: string | null;
    admin_notes: string | null;
    delivery_address: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    customer?: User;
    equipment?: Equipment;
    operator?: User;
    status_history?: RentalStatusHistory[];
    created_at: string;
    updated_at: string;
};

export type RentalStatusHistory = {
    id: number;
    rental_id: number;
    from_status: RentalStatus | null;
    to_status: RentalStatus;
    changed_by: number;
    notes: string | null;
    user?: User;
    created_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
};
