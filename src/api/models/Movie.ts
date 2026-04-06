export interface ApiRequestParams {
    sortOrder: 'asc' | 'desc';
    sortBy: 'title' | 'releaseDate';
    search?: string;
    searchBy: 'title' | 'genres';
    filter?: string[];
    offset: number;
    limit: number;
}

export interface ApiMovie {
    title: string;
    tagline: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
    poster_path: string;
    overview: string;
    budget: number;
    revenue: number;
    runtime: number;
    genres: string[];
    id: number;
}

export interface ApiPageResponse {
    data: ApiMovie[];
    totalAmount: number;
    offset: number;
    limit: number;
}

export interface ApiResponse {
    content: ApiPageResponse | undefined;
    isLoading: boolean;
    isError: Error | undefined;
    loadMore?: () => void;
    isReachingEnd?: boolean;
}