import { z } from 'zod';

export const movieSchema = z.object({
    id: z.number().optional(),
    imageUrl: z.url("Invalid URL format."),
    title: z.string().min(1, "Title is required."),
    releaseDate: z.coerce.date().max(new Date(), "Release date cannot be in the future."),
    genres: z.array(z.object({
        value: z.string().min(1, "Genre value is required."),
        label: z.string().min(1, "Genre label is required."),
    })).min(1, "Select at least one genre to proceed."),    
    duration: z.number().min(1, "Runtime must be at least 1 minute."),
    description: z.string().min(1, "Description is required."),
    rating: z.number().min(0, "Rating must be at least 0.").max(10, "Rating cannot exceed 10."),
});