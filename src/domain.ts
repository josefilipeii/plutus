export interface Country {
    country_id: number;
    iso_3166_1: string;
    name: string;
}

export interface Company {
    company_id: number;
    name: string;
    email: string;
    vat: string;
    address: string;
    city: string;
    zip_code: string;
    country_id: number;
    image: string;
    country: Country;
}


export interface ClientData {
    number: string;
    name: string;
    vat?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    zip_code?: string;
}



export interface Template {
    template_id: number;
    name: string;
    business_name: string;
    email: string;
    address: string;
    city: string;
    zip_code: string;
    country_id: number;
    phone: string;
    fax: string;
    website: string;
    notes: string;
    documents_footnote: string;
    email_sender_name: string;
    email_sender_address: string;
    image: string;
}

export interface DocumentSet {
    document_set_id: number;
    name: string;
    cash_vat_scheme_indicator: number;
    active_by_default: number;
    template_id: number;
    img_gr_1: string;
    template: Template;
}


export interface Country {
    country_id: number;
    country: string;
    iso_3166_1: string;
}

export interface Language {
    language_id: number;
    code: string;
    name: string;
}

export interface MaturityDate {
    maturity_date_id: number;
    name: string;
    days: number;
    associated_discount: number;
}

export interface PaymentMethod {
    payment_method_id: number;
    name: string;
}

export interface DeliveryMethod {
    delivery_method_id: number;
    name: string;
}

export interface Salesman {
    salesman_id: number;
    number: string;
    name: string;
    base_commission: number;
}

export interface AlternateAddress {
    address_id: number;
    designation: string;
    code: string;
    address: string;
    city: string;
    zip_code: string;
    country_id: number;
    email: string;
    phone: string;
    fax: string;
    contact_name: string;
}

export interface Copy {
    document_type_id: number;
    copies: number;
}

export interface AssociatedTax {
    tax_id: number;
}

export interface PriceClass {
    price_class_id: number;
    title: string;
}

export interface Customer {
    customer_id: number;
    number: string;
    name: string;
    vat: string;
    address: string;
    city: string;
    zip_code: string;
    country_id: number;
    email: string;
    website: string;
    phone: string;
    fax: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
    salesman_id: number;
    discount: number;
    credit_limit: number;
    maturity_date_id: number;
    payment_day: number;
    field_notes: string;
    language_id: number;
    payment_method_id: number;
    delivery_method_id: number;
    country: Country;
    language: Language;
    maturity_date: MaturityDate;
    payment_method: PaymentMethod;
    delivery_method: DeliveryMethod;
    salesman: Salesman;
    alternate_addresses: AlternateAddress[];
    copies: Copy[];
    associated_taxes: AssociatedTax[];
    price_class: PriceClass;
}


export interface CreateInvoiceResponse {
    valid: boolean;
    document_id: string;
}