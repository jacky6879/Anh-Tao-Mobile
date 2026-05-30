/**
 * backend.js - Dynamic Database & CRM Integration Mock (VibeMobile)
 * Integrated Supabase / Firebase / Google Sheets CRM Pipeline
 */

// 1. Core Configuration (Placeholder for production keys - ready to swap)
const BACKEND_CONFIG = {
    provider: 'local-mock', // Choices: 'supabase', 'firebase', 'local-mock'
    supabase: {
        url: 'https://your-supabase-project.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here'
    },
    firebase: {
        apiKey: "AIzaSyDummyKey_1234567890",
        authDomain: "vibemobile-ecom.firebaseapp.com",
        projectId: "vibemobile-ecom",
        storageBucket: "vibemobile-ecom.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456:web:abcd1234"
    },
    googleSheets: {
        webhookUrl: 'https://script.google.com/macros/s/AKfycbz_your_script_id/exec'
    }
};

// 2. Data Store Proxy (Direct read/write utilizing localStorage)
class LocalMockDatabase {
    constructor() {
        this.initializeDB();
    }

    initializeDB() {
        if (!localStorage.getItem('vibemobile_leads')) {
            localStorage.setItem('vibemobile_leads', JSON.stringify([]));
        }
        if (!localStorage.getItem('vibemobile_cart')) {
            localStorage.setItem('vibemobile_cart', JSON.stringify([]));
        }
        console.log("⚡ [Anh Táo Mobile DB] Mock Database Initialized successfully.");
    }

    // Insert lead info (Google Sheets CRM & DB sync mock)
    async insertLead(leadData) {
        console.group("🚀 [API Request] Submit Form Lead to CRM & DB");
        console.log("Configured Provider:", BACKEND_CONFIG.provider);
        console.log("Form Payload:", leadData);

        // Simulate network latency (500ms)
        await new Promise(resolve => setTimeout(resolve, 600));

        // Save locally
        const leads = JSON.parse(localStorage.getItem('vibemobile_leads'));
        const newLead = {
            id: 'lead_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'Pending',
            ...leadData
        };
        leads.push(newLead);
        localStorage.setItem('vibemobile_leads', JSON.stringify(leads));

        // Supabase direct integration logic (Pre-wired)
        if (BACKEND_CONFIG.provider === 'supabase') {
            try {
                console.log("Connecting Supabase API... POST /rest/v1/leads");
                // const { data, error } = await supabase.from('leads').insert([newLead]);
            } catch (e) {
                console.warn("Supabase network error, fell back to local proxy", e);
            }
        }

        // Google Sheets Integration logic (Pre-wired webhook trigger)
        if (BACKEND_CONFIG.provider === 'google-sheets') {
            try {
                console.log("Dispatching payload to Google App Script Webhook:", BACKEND_CONFIG.googleSheets.webhookUrl);
                // fetch(BACKEND_CONFIG.googleSheets.webhookUrl, { method: 'POST', body: JSON.stringify(newLead) });
            } catch (e) {
                console.warn("Google Sheets webhook error, fell back to local proxy", e);
            }
        }

        console.log("Response [200 OK]: Lead captured successfully.", newLead);
        console.groupEnd();
        return { success: true, lead: newLead };
    }

    // Retrieve leads list (Admin capability)
    getLeads() {
        return JSON.parse(localStorage.getItem('vibemobile_leads')) || [];
    }

    // Clear leads
    clearLeads() {
        localStorage.setItem('vibemobile_leads', JSON.stringify([]));
        return true;
    }
}

const mockDB = new LocalMockDatabase();

// 3. 0% Installment Calculator
function calculateInstallment(totalPrice, termMonths) {
    const interestRate = 0.00; // 0% Interest Support
    const conversionFeeRate = 0.02; // Small 2% processing conversion fee (typical in Vietnam e-commerce)
    
    const baseMonthlyPayment = Math.round(totalPrice / termMonths);
    const conversionFee = Math.round(totalPrice * conversionFeeRate);
    const firstMonthExtra = conversionFee;
    
    return {
        term: termMonths,
        monthlyPrincipal: baseMonthlyPayment,
        conversionFee: conversionFee,
        monthlyTotal: baseMonthlyPayment,
        firstMonthTotal: baseMonthlyPayment + conversionFee,
        totalPayable: totalPrice + conversionFee
    };
}

// 4. Dynamic VietQR Generation API Helper (standard in Vietnam)
// Format VietQR link based on NAPAS standard
function generateVietQR(amount, description, accountNo = "19033481234567", bankId = "Techcombank") {
    // Standard VietQR link using Quick Link services
    const descEncoded = encodeURIComponent(description);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${descEncoded}&accountName=ANH%20TAO%20MOBILE`;
}
