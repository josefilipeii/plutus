import {ClientData, Company, CreateInvoiceResponse, Customer, DocumentSet} from "./domain";
import {MoloniConfig} from "./config";
import {BaseResponse, fetchMoloniAPI} from "./client";
import {
    BASE_URL,
    CUSTOMERS_BASE_URL,
    DOCUMENT_SETS_BASE_URL,
    INVOICES_BASE_URL,
    INVOICES_RECEIPS_BASE_URL,
    PAYMENT_METHODS_BASE_URL,
    PRODUCTS_BASE_URL
} from "./constant";

export class MoloniHelper {
    private cachedToken: string | null = null;
    private selectedCompany: Company | null | undefined = null;

    constructor(private config: MoloniConfig) {
    }

    private async loadToken() {
        if (!this.cachedToken) {
            this.cachedToken = await this.fetchMoloniToken();
        }
        if (!this.cachedToken) throw new Error('Could not fetch Moloni token');
        return this.cachedToken;
    }

    private async loadCompany() {
        if (!this.selectedCompany) {
            const companies = await this.fetchCompanies() || [];
            this.selectedCompany = companies.find(c => c.vat === this.config.vatNumber);
        }
        if (!this.selectedCompany) throw new Error('Could not find company');
        return this.selectedCompany;
    }

    private async fetchMoloniToken(): Promise<string | null> {
        if (this.cachedToken) return this.cachedToken;

        const url = `${BASE_URL}grant/?` + new URLSearchParams({
            grant_type: 'password',
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            username: this.config.username,
            password: this.config.password,
        });

        const response = await fetch(url.toString());
        if (!response.ok) return null;
        const data = await response.json();
        this.cachedToken = data.access_token;
        return this.cachedToken;
    }


    async fetchPaymentMethods(token: string, companyId: number) {
        const url = `${PAYMENT_METHODS_BASE_URL}/getAll/?json=true&access_token=${token}`;
        return fetchMoloniAPI(url, {company_id: companyId});
    }

    async getDocumentSets() {
        const token = await this.loadToken();
        const company = await this.loadCompany();
        const url = `${DOCUMENT_SETS_BASE_URL}/getAll/?json=true&access_token=${token}`;
        return fetchMoloniAPI(url, {company_id: company.company_id}) as Promise<DocumentSet[]>;
    }

    async findDocumentSet() {
        const sets = await this.getDocumentSets();
        return sets.find((s: any) => s.name === this.config.invoiceSerie);
    }

    private async fetchClientData(clientVatNumber?: string, clientEmail?: string) {
        const company = await this.loadCompany();
        const company_id = company.company_id;
        if (clientVatNumber) {
            const result = await this.customerApi('getByVat', {company_id, vat: clientVatNumber}) as Customer[];
            if (result?.length > 0) return result;
        }
        if (clientEmail) {
            const result = await this.customerApi('getBySearch', {company_id, search: clientEmail}) as Customer[];
            if (result?.length > 0) return result;
        }
        return [];
    }


    private async customerApi(endpoint: string, payload: any) {
        const token = await this.loadToken();
        const url = `${CUSTOMERS_BASE_URL}/${endpoint}/?json=true&human_errors=true&access_token=${token}`;
        return fetchMoloniAPI(url, payload);
    }

    private async newClientId() {
        const company = await this.loadCompany();
        const company_id = company.company_id;
        return await this.customerApi('getNextNumber', {company_id}) as { number: string };
    }

    async createClient(clientData: any) {
        const token = await this.loadToken();
        const company = await this.loadCompany();
        const payload = {
            company_id: company.company_id,
            number: clientData.number,
            name: clientData.name,
            vat: clientData.vat || '999999990',
            email: clientData.email,
            phone: clientData.phone || '',
            country_id: 1,
            language_id: 1,
            address: clientData.address || '',
            city: clientData.city || '',
            zip_code: clientData.zip_code || '',
            salesman_id: 1,
            maturity_date_id: 1,
            payment_day: 1,
            discount: 0,
            credit_limit: 0,
            payment_method_id: 0,
            delivery_method_id: 0
        };
        const response = await this.customerApi('insert', payload) as BaseResponse;
        return response?.valid ? response : {valid: 0, errors: response};
    }


    async getOrCreateClient(clientData: ClientData) {
        const client = await this.fetchClientData(clientData.vat, clientData.email);
        if (client?.length > 0) return {valid: 1, customer_id: client[0].customer_id};

        const next = await this.newClientId();
        const data = {...clientData, number: next.number};
        return this.createClient(data);
    }


    async createInvoiceReceipt(data: any) {
        const token = await this.loadToken();
        const company = await this.loadCompany();
        const company_id = company.company_id;
        const payload = {company_id, ...data};
        const url = `${INVOICES_RECEIPS_BASE_URL}/insert/?human_errors=false&json=true&access_token=${token}`;
        const response = await fetchMoloniAPI(url, payload) as CreateInvoiceResponse;
        return response?.valid ? response : {valid: 0, errors: response};
    }


    async updateInvoiceReceipt(data: any) {
        const token = await this.loadToken();
        const company = await this.loadCompany();
        const company_id = company.company_id;
        const payload = {company_id, ...data};
        const url = `${INVOICES_RECEIPS_BASE_URL}/update/?human_errors=false&json=true&access_token=${token}`;
        const response = await fetchMoloniAPI(url, payload) as BaseResponse;
        return response?.valid ? response : {valid: 0, errors: response};
    }


    async getInvoiceByReference(reference: string) {
        const token = await this.loadToken();
        const company = await this.loadCompany();
        const company_id = company.company_id;
        const url = `${INVOICES_BASE_URL}/getOne/?json=true&human_errors=true&access_token=${token}`;
        return fetchMoloniAPI(url, {company_id, your_reference: reference});
    }

    async getProductByName(name: string) {
        const token = await this.loadToken();
        const company = await this.loadCompany();
        const company_id = company.company_id;
        const url = `${PRODUCTS_BASE_URL}/getByName/?human_errors=false&json=true&access_token=${token}`;
        return fetchMoloniAPI(url, {company_id, name});
    }


    private async fetchCompanies() {
        const token = await this.loadToken();
        const url = `${BASE_URL}companies/getAll/?access_token=${token}`;
        const response = await fetch(url);
        return await response.json() as Company[];
    }


}