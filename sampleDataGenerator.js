function generateSampleData() {
    const regions = ['London', 'Berlin', 'Paris', 'Rome', 'Madrid'];
    const productTypes = ['Mobile', 'Broadband'];
    const accountStatuses = ['Active', 'Inactive'];
    const callTypes = ['Incoming', 'Outgoing'];
    const smsTypes = ['Text', 'Multimedia'];

    const products = [
        { product_name: 'Mobile Plan A', product_type: 'Mobile', price: 29.99, description: 'Basic mobile plan', launch_date: '2023-01-01' },
        { product_name: 'Mobile Plan B', product_type: 'Mobile', price: 49.99, description: 'Premium mobile plan', launch_date: '2023-02-01' },
        { product_name: 'Broadband Plan A', product_type: 'Broadband', price: 39.99, description: 'Basic broadband plan', launch_date: '2023-03-01' },
        { product_name: 'Broadband Plan B', product_type: 'Broadband', price: 59.99, description: 'Premium broadband plan', launch_date: '2023-04-01' }
    ];

    const customers = [];
    for (let i = 1; i <= 10; i++) { // 10 customers
        const firstName = `FirstName${i}`;
        const lastName = `LastName${i}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
        const phoneNumber = `+1-800-${i.toString().padStart(4, '0')}`;
        const dateOfBirth = new Date(Date.now() - Math.floor(Math.random() * (65 - 18 + 1)) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const address = `Address ${i}`;
        const city = regions[Math.floor(Math.random() * regions.length)];
        const country = 'Country';
        const signupDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const accountStatus = accountStatuses[Math.floor(Math.random() * accountStatuses.length)];
        
        customers.push({ first_name: firstName, last_name: lastName, email, phone_number: phoneNumber, date_of_birth: dateOfBirth, address, city, country, signup_date: signupDate, account_status: accountStatus });
    }

    const customerProducts = [];
    for (let customerId = 1; customerId <= 10; customerId++) {
        for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) { // 1 to 3 products per customer
            const productId = Math.floor(Math.random() * products.length) + 1;
            const startDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const endDate = new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const status = Math.random() > 0.5 ? 'Active' : 'Inactive';
            
            customerProducts.push({ customer_id: customerId, product_id: productId, start_date: startDate, end_date: endDate, status });
        }
    }

    const callRecords = [];
    for (let customerId = 1; customerId <= 10; customerId++) {
        for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) { // 1 to 5 call records per customer
            const callStartTime = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
            const callEndTime = new Date(new Date(callStartTime).getTime() + Math.floor(Math.random() * 60) * 60 * 1000).toISOString();
            const duration = Math.floor((new Date(callEndTime) - new Date(callStartTime)) / (60 * 1000));
            const callType = callTypes[Math.floor(Math.random() * callTypes.length)];
            const callInitiationRegion = regions[Math.floor(Math.random() * regions.length)];
            const callDestinationRegion = regions[Math.floor(Math.random() * regions.length)];
            
            callRecords.push({ customer_id: customerId, call_start_time: callStartTime, call_end_time: callEndTime, duration, call_type: callType, call_initiation_region: callInitiationRegion, call_destination_region: callDestinationRegion });
        }
    }

    const smsRecords = [];
    for (let customerId = 1; customerId <= 10; customerId++) {
        for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) { // 1 to 5 SMS records per customer
            const smsTime = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString();
            const smsType = smsTypes[Math.floor(Math.random() * smsTypes.length)];
            const smsInitiationRegion = regions[Math.floor(Math.random() * regions.length)];
            const smsDestinationRegion = regions[Math.floor(Math.random() * regions.length)];
            const smsLength = Math.floor(Math.random() * (200 - 10 + 1)) + 10; // SMS length between 10 and 200 characters
            
            smsRecords.push({ customer_id: customerId, sms_time: smsTime, sms_type: smsType, sms_initiation_region: smsInitiationRegion, sms_destination_region: smsDestinationRegion, sms_length: smsLength });
        }
    }

    const dataUsage = [];
    for (let customerId = 1; customerId <= 10; customerId++) {
        for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) { // 1 to 3 data usage records per customer
            const usageDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const dataUsedMb = Math.floor(Math.random() * (5000 - 100 + 1)) + 100; // Data usage between 100 MB and 5000 MB
            const region = regions[Math.floor(Math.random() * regions.length)];
            
            dataUsage.push({ customer_id: customerId, usage_date: usageDate, data_used_mb: dataUsedMb, region });
        }
    }

    return {
        products,
        customers,
        customerProducts,
        callRecords,
        smsRecords,
        dataUsage
    };
}

// Generate and log sample data
const printSampleData = generateSampleData();
console.log("Sample Data:", printSampleData);
