export interface UserPreferences {
  budget: string;
  style: string[];
  destinations: string[];
  accommodation: string;
  alerts: string[];
}

export interface SearchHistory {
  type: string;
  query: any;
  timestamp: string;
}

export interface LocalStorageData {
  user: {
    id: number;
    name: string;
    email: string;
    preferences: UserPreferences;
  };
  searchHistory: SearchHistory[];
  favorites: number[];
}

export class LocalStorageService {
  private static readonly USER_KEY = "travelmate_user";
  private static readonly SEARCH_HISTORY_KEY = "travelmate_search_history";
  private static readonly FAVORITES_KEY = "travelmate_favorites";

  static getUser() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getSearchHistory(): SearchHistory[] {
    const history = localStorage.getItem(this.SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  static addSearchHistory(search: SearchHistory) {
    const history = this.getSearchHistory();
    history.unshift(search);
    // Keep only last 50 searches
    if (history.length > 50) {
      history.splice(50);
    }
    localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(history));
  }

  static getFavorites(): number[] {
    const favorites = localStorage.getItem(this.FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  static addFavorite(id: number) {
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  static removeFavorite(id: number) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(id);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  static isFavorite(id: number): boolean {
    return this.getFavorites().includes(id);
  }

  static clear() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.SEARCH_HISTORY_KEY);
    localStorage.removeItem(this.FAVORITES_KEY);
  }

  static initialize() {
    // Initialize with default user if not exists
    if (!this.getUser()) {
      this.setUser({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        preferences: {
          budget: "$1,000 - $2,500",
          style: ["Adventure & Outdoor", "Beach & Relaxation"],
          destinations: ["Europe", "Asia"],
          accommodation: "Mid-range (3★ Hotels, B&Bs)",
          alerts: ["Price drop alerts", "New deals notifications"]
        }
      });
    }
  }
}
