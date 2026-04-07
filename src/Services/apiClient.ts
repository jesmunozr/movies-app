import useSWR from "swr";
import { config } from "@/config/config";
import type { ApiPageResponse, ApiRequestParams, ApiResponse } from "@/api/models/Movie";
import useSWRInfinite from "swr/infinite";
import { useMemo } from "react";

const fetcher = ([_, params]: [string, ApiRequestParams]) => getMovies(params);

const buildMoviesUrl = (params: ApiRequestParams) => {
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

    return `${config.apiBaseUrl}/movies?${queryParams.toString()}`;
};

async function getMovies(params: ApiRequestParams): Promise<ApiPageResponse> {

    try{
        const response = await fetch(buildMoviesUrl(params));
        return response.json();
    }catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

function useMovies(apiRequestParams: ApiRequestParams) {

    const { data, error, isLoading } = useSWR(['movies', apiRequestParams], fetcher);

    const apiResponse: ApiResponse = {
        content: data,
        isLoading: isLoading,
        isError: error,
    };

    return apiResponse;
}

function useMoviesInfinite(params: Omit<ApiRequestParams, 'offset' | 'limit'>) {
    const PAGE_SIZE = 12;

    const stableParams = useMemo(() => params, [params]);

    const getKey = (pageIndex: number, previousPageData: ApiPageResponse | null) => {
        if (previousPageData && previousPageData.data.length < PAGE_SIZE) return null; // No more data to fetch
        return [
            'movies',
            {
                ...stableParams,
                offset: pageIndex * PAGE_SIZE,
                limit: PAGE_SIZE,
            }
        ];
    };

    const { data, error, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, { 
        revalidateFirstPage: false,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });

    const isReachingEnd = data && (data[data.length - 1]?.data.length < PAGE_SIZE);
    const isLoadingMode = isLoading || (data && typeof data[size - 1] === "undefined");
    const loadMode = () => {
        if (!isLoadingMode && !isReachingEnd) {
            setSize(size + 1);
        }
    }

    const apiResponse: ApiResponse = {
        content: data ? {
            data: data.flatMap(page => page.data),
            totalAmount: data[0]?.totalAmount || 0,
            offset: (size - 1) * PAGE_SIZE,
            limit: PAGE_SIZE,
        } : undefined,
        isLoading,
        isError: error,
        loadMore: loadMode,
        isReachingEnd: isReachingEnd,
    };

    return apiResponse;
}

export { useMovies, useMoviesInfinite };