import { GenresContext } from '../MovieListPage/MovieListPage.tsx';
import { useContext, useEffect } from "react";
import Select, { type CSSObjectWithLabel, type GroupBase, type StylesConfig } from "react-select";
import "./MovieForm.css";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { movieSchema } from '@/domain/schemas/movie.schema.ts';
import { useCreateMovie, useMovie, useUpdateMovie } from '@/Services/apiClient.ts';
import type { Movie } from '@/domain/models/Movie.ts';
import { useOutletContext, useParams } from 'react-router-dom';

export default function MovieForm({onSubmitted}: { onSubmitted: () => void }) {
    const { onMovieUpdated, onMovieCreated } = useOutletContext<{ onMovieUpdated: (movie: Movie) => void, onMovieCreated: (movie: Movie) => void }>();
    const genresList = useContext(GenresContext);
    const params = useParams();
    const isEditMode = Boolean(params.movieId);
    const { createMovie, isCreating } = useCreateMovie();
    const { updateMovie, isUpdating } = useUpdateMovie();
    const { content } = useMovie(isEditMode ? Number(params.movieId) : undefined);
    

    /** Custom styles for the react-select component */
    const selectGenreCustomStyles: StylesConfig<{ value: string; label: string; }, true, GroupBase<{ value: string; label: string; }>> = {
        control: (base: CSSObjectWithLabel) => ({
            ...base,
            border: "none",
            fontSize: "1.5em",
            color: "rgba(255, 255, 255, 0.7)",
            backgroundColor: "rgba(50, 50, 50, 0.95)",
            padding: "8px",
            textTransform: "none",
            fontWeight: "normal",
        }),
        valueContainer: (base: CSSObjectWithLabel) => ({
            ...base,
            padding: "0",
        }),
        dropdownIndicator: (base: CSSObjectWithLabel) => ({
            ...base,
            color: "#f65251",
            padding: "0 0 0 8px",
            ":hover": {
                color: "#f65261",
            },
        }),
        indicatorSeparator: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: "#f65251",
        }),
        clearIndicator: (base: CSSObjectWithLabel) => ({
            ...base,
            color: "#f65251",
            padding: "0 8px",
            ":hover": {
                color: "#f65261",
            },
        }),
        multiValue: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: "rgba(23, 23, 23, 0.30)",
        }),
        multiValueLabel: (base: CSSObjectWithLabel) => ({
            ...base,
            color: "#ffffffb3",
        }),
        menu: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: "#232323eb",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }),
        option: (base: CSSObjectWithLabel, props: {isFocused: boolean}) => ({
            ...base,
            backgroundColor: props.isFocused ? "#f65261" : "transparent",
            color: "#ffffffb3",
            textTransform: "none",
            border: "none",
            fontWeight: "normal",
            fontSize: "medium",
        }),
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        resolver: zodResolver(movieSchema),
        defaultValues: {
            title: "",
            releaseDate: new Date().toISOString().split("T")[0],
            imageUrl: "",
            rating: 0,
            genres: [],
            duration: 0,
            description: "",
        }
    });

    useEffect(() => {
        if (content) {
            reset({
                id: content.id,
                title: content.title || "",
                releaseDate: content.releaseDate ? content.releaseDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                imageUrl: content.imageUrl || "",
                rating: content.rating || 0,
                genres: content.genres || [],
                duration: content.duration || 0,
                description: content.description || "",
            });
        }
    }, [content, reset]);


    const onSubmitHandler = async (data: Movie) => {
        console.log("Submitted data:", data);
        if (isEditMode) {
            const updated = await updateMovie(data);
            onMovieUpdated(updated);
        } else {
            const created =await createMovie(data);
            onMovieCreated(created);
        }
        onSubmitted();
    };

    const onError = (errors: any) => {
        console.log("FORM ERRORS:", errors);
    };

    return (
        <form data-testid="movie-form" className="movie-form" 
            onSubmit={handleSubmit(onSubmitHandler, onError)} 
            onReset={(e) => {
                e.preventDefault();
                reset();
            }}
        >
            <label className="col-left">
                Title
                <input {...register("title")} placeholder="Movie Name" />
                {errors.title && <span className="error">{errors.title.message}</span>}
            </label>
            <label className="col-right">
                Release Date
                <input type="date" {...register("releaseDate", { valueAsDate: true })} />
                {errors.releaseDate && <span className="error">{errors.releaseDate.message}</span>}
            </label>
            <label className="col-left">
                Movie Url
                <input type="text" {...register("imageUrl")} placeholder="https://" />
                {errors.imageUrl && <span className="error">{errors.imageUrl.message}</span>}
            </label>
            <label className="col-right">
                Rating
                <input type="number" {...register("rating", { valueAsNumber: true })} placeholder="Rating" />
                {errors.rating && <span className="error">{errors.rating.message}</span>}
            </label>
            <label className="col-left" htmlFor="genres">
                Genres
                <Controller
                    control={control}
                    name="genres"
                    render={({ field }) => (
                        <Select 
                            {...field}
                            options={ genresList }
                            isMulti 
                            placeholder="Select Genres" 
                            classNamePrefix="select-genres"
                            styles={selectGenreCustomStyles}
                            inputId="genres"
                            name="genres"
                        />
                    )}
                />
                {errors.genres && <span className="error">{errors.genres.message}</span>}
            </label>
            <label className="col-right">
                Runtime
                <input type="number" {...register("duration", { valueAsNumber: true })} placeholder="Minutes" />
                {errors.duration && <span className="error">{errors.duration.message}</span>}
            </label>
            <label className="full-width">
                Overview
                <textarea {...register("description")} placeholder="Movie description"></textarea>
                {errors.description && <span className="error">{errors.description.message}</span>}
            </label>
            <div className="button-group full-width">
                <button type="reset" className="border-button" disabled={isCreating || isUpdating}>Reset</button>
                <button type="submit" className="red-button" disabled={isCreating || isUpdating}>Submit</button>
            </div>
        </form>
    );
}