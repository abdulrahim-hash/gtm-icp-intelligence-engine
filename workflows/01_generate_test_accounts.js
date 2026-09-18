// n8n Code node: Generate Test Accounts
// Mode: Run Once for All Items
//
// Produces two safe test records for validating idempotent ingestion.

return [
  {
    json: {
      company_name: "GTM Ingestion Test Cleaning One",
      website_url: "https://www.example.com/services",
      city: "Dallas",
      state: "Texas",
      country: "United States",
      industry: "Janitorial Services",
      discovery_source: "manual_n8n_test",
      discovery_source_id: "test-001",
      source_query: "day2 ingestion smoke test",
      is_test_record: true
    }
  },
  {
    json: {
      company_name: "GTM Ingestion Test Cleaning Two",
      city: "Charlotte",
      state: "North Carolina",
      country: "United States",
      industry: "Janitorial Services",
      discovery_source: "manual_n8n_test",
      discovery_source_id: "test-002",
      source_query: "day2 ingestion smoke test",
      is_test_record: true
    }
  }
];
