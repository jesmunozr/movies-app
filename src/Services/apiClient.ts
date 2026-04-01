import useSWR from "swr";
import { config } from "@/config/config";
import type { ApiPageResponse, ApiRequestParams, ApiResponse } from "@/api/models/Movie";

async function getMovies({path, params}: {path: string, params: ApiRequestParams}): Promise<ApiPageResponse> {

    const queryParams = new URLSearchParams();

    if (params.search) {
        queryParams.append('search', params.search);
    }
    queryParams.append('searchBy', params.searchBy);
    
    if (params.filter && params.filter.length > 0) {
        queryParams.append('filter', params.filter.join(','));
    }

    queryParams.append("sortBy", params.sortBy);
    queryParams.append("sortOrder", params.sortOrder);
    queryParams.append("offset", params.offset.toString());
    queryParams.append("limit", params.limit.toString());

    const url = `${config.apiBaseUrl}${path}?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    return (await response.json()) as ApiPageResponse;
}

function useMovies(apiRequestParams: ApiRequestParams) {

    const { data, error, isLoading } = useSWR({path: '/movies', params: apiRequestParams}, getMovies);

    const apiResponse: ApiResponse = {
        content: data,
        isLoading: isLoading,
        isError: error,
    };

    return apiResponse;
}

export { useMovies };