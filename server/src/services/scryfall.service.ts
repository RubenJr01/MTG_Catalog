// Scryfall API Service
// API Docs: https://scryfall.com/docs/api
// Rate limit: 10 requests per second

const SCRYFALL_API = 'https://api.scryfall.com';

export const scryfallService = {
  // TODO: Implement Scryfall API methods

  // Search cards by name
  async searchCards(query: string) {
    // const response = await fetch(`${SCRYFALL_API}/cards/search?q=${encodeURIComponent(query)}`);
    // return response.json();
  },

  // Autocomplete card names
  async autocomplete(query: string) {
    // const response = await fetch(`${SCRYFALL_API}/cards/autocomplete?q=${encodeURIComponent(query)}`);
    // return response.json();
  },

  // Get card by Scryfall ID
  async getCardById(id: string) {
    // const response = await fetch(`${SCRYFALL_API}/cards/${id}`);
    // return response.json();
  }
};
