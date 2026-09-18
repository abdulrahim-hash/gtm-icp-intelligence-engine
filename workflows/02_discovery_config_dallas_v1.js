// n8n Code node: Discovery Config - Dallas V1
// Mode: Run Once for All Items
//
// First controlled live discovery batch.
// Intentionally small. No leads enrichment / contact enrichment.

return [
  {
    json: {
      run_type: "apify_google_maps_discovery",
      market: "US commercial cleaning",
      location_query: "Dallas, Texas, United States",
      search_strings: [
        "commercial cleaning",
        "janitorial service"
      ],
      max_places_per_search: 20,
      actor_input: {
        searchStringsArray: [
          "commercial cleaning",
          "janitorial service"
        ],
        locationQuery: "Dallas, Texas, United States",
        maxCrawledPlacesPerSearch: 20,
        language: "en",
        scrapeSocialMediaProfiles: {
          facebooks: false,
          instagrams: false,
          youtubes: false,
          tiktoks: false,
          twitters: false
        },
        maximumLeadsEnrichmentRecords: 0
      }
    }
  }
];
