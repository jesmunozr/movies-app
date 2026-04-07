import { GenresContext } from '../MovieListPage/MovieListPage.tsx';
import { useEffect, useState, useContext } from "react";
import Select, { type ActionMeta, type CSSObjectWithLabel, type GroupBase, type MultiValue, type StylesConfig } from "react-select";
import "./MovieForm.css";
import type { Movie, MovieGenre } from '@/domain/models/Movie.ts';

interface MovieFormProps extends Movie {
    /** A function to be called when the form is submitted. */
    onSubmit: (movie: Movie) => void;
}

type Errors = {
    title?: string;
    releaseDate?: string;
    imageUrl?: string;
    rating?: string;
    genres?: string;
    duration?: string;
    description?: string;
}

const MovieForm = ({imageUrl, title, releaseDate, genres, duration, description, rating, onSubmit }: MovieFormProps) => {
    const [formData, setFormData] = useState<Movie>(
    { 
        imageUrl: imageUrl, 
        title: title, 
        releaseDate: releaseDate, 
        genres: genres, 
        duration: duration, 
        description: description, 
        rating: rating 
    });
    const [errors, setErrors] = useState<Errors>({});
    const [selectedGenres, setSelectedGenres] = useState<MovieGenre[]>([]);
    const genresList = useContext(GenresContext);

    useEffect(() => {
        /* If genres are provided as props, set the selected genres based on the provided genres and the genres list. This ensures that the correct genres are selected when editing an existing movie. */
        if (genres && genres.length > 0) {
            const selectedGenres = genresList?.filter(
                option => genres.some(genre => genre.value === option.value)
            );
            setSelectedGenres(selectedGenres || []);
        }
    }, []);

    /** Handle input change */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: string | number | Date | Array<string> | null = value;

        if (type === "number") {
            parsedValue = value === "" ? 0 : Number(value);
        }

        if (type === "date") {
            parsedValue = value ? new Date(value) : null;
        }

        if (name === "releaseDate") {
            setFormData(prev => ({
                ...prev,
                [name]: new Date(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: parsedValue
            }));
        }
    };

    /** Handle form submission */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
    };

    /** Handle form reset */
    const handleReset = () => {
        setFormData({
            description: "",
            duration: undefined,
            genres: [],
            imageUrl: "",
            rating: undefined,
            releaseDate: undefined,
            title: ""
        });
        setSelectedGenres([]);
        setErrors({});
    };

    /** Validate form data */
    const validate = (data: Movie) => {
        const newErrors: Errors = {};

        /** Validate title */
        if (!data.title || data.title.trim() === "") {
            newErrors.title = "Title is required.";
        }

        /** Validate release date */
        if (data.releaseDate === undefined || data.releaseDate === null) {
            newErrors.releaseDate = "Release date is required.";
        } else if (data.releaseDate && isNaN(data.releaseDate.getTime())) {
            newErrors.releaseDate = "Invalid date format.";
        }

        /** Validate image URL */
        if (!data.imageUrl || data.imageUrl.trim() === "") {
            newErrors.imageUrl = "Image URL is required.";
        } else if (data.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(data.imageUrl)) {
            newErrors.imageUrl = "Invalid image URL.";
        }
        /** Validate rating */
        if (data.rating === undefined || data.rating === null) {
            newErrors.rating = "Rating is required.";
        } else if (data.rating !== undefined && (data.rating < 1 || data.rating > 10)) {
            newErrors.rating = "Rating must be between 1 and 10.";
        }

        /** Validate genres */
        if (!data.genres || data.genres.length === 0) {
            newErrors.genres = "Select at least one genre to proceed.";
        }

        /** Validate duration */
        if (data.duration === undefined || data.duration === null) {
            newErrors.duration = "Duration is required.";
        } else if (data.duration !== undefined && data.duration <= 0) {
            newErrors.duration = "Duration must be a positive number.";
        }
        /** Validate description */
        if (!data.description || data.description.trim() === "") {
            newErrors.description = "Description is required.";
        }
        return newErrors;
    };

    /** Handle genre selection change */
    const onGenreChange = (option: MultiValue<MovieGenre>, actionMeta: ActionMeta<{value: string, label: string}>) => {
        const selectedValues = option;
        setSelectedGenres(option as MovieGenre[]);
        setFormData(prev => ({
            ...prev,
            genres: selectedValues as MovieGenre[]
        }));
    };

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

    return (
        <form data-testid="movie-form" className="movie-form" 
            onSubmit={handleSubmit} 
            onReset={(e) => {
                e.preventDefault();
                handleReset();
            }}
        >
            <label className="col-left">
                Title
                <input type="text" name="title" value={formData.title} placeholder="Movie Name" onChange={handleChange}/>
                {errors.title && <span className="error">{errors.title}</span>}
            </label>
            <label className="col-right">
                Release Date
                <input type="date" name="releaseDate" value={formData.releaseDate !== undefined ? formData.releaseDate.toISOString().split('T')[0] : ""} onChange={handleChange} />
                {errors.releaseDate && <span className="error">{errors.releaseDate}</span>}
            </label>
            <label className="col-left">
                Movie Url
                <input type="text" name="imageUrl" value={formData.imageUrl} placeholder="https://" onChange={handleChange} />
                {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
            </label>
            <label className="col-right">
                Rating
                <input type="number" name="rating" value={formData.rating === undefined || formData.rating === null ? "" : formData.rating} placeholder="Rating" onChange={handleChange} />
                {errors.rating && <span className="error">{errors.rating}</span>}
            </label>
            <label className="col-left">
                Genres
                <Select 
                    options={genresList} 
                    isMulti 
                    placeholder="Select Genres" 
                    onChange={onGenreChange} 
                    value={selectedGenres}
                    classNamePrefix={"select-genres"}
                    styles={selectGenreCustomStyles}/>
                {errors.genres && <span className="error">{errors.genres}</span>}
            </label>
            <label className="col-right">
                Runtime
                <input type="number" name="duration" value={formData.duration === undefined || formData.duration === null ? "" : formData.duration} placeholder="Minutes" onChange={handleChange} />
                {errors.duration && <span className="error">{errors.duration}</span>}
            </label>
            <label className="full-width">
                Overview
                <textarea name="description" value={formData.description} placeholder="Movie description" onChange={handleChange}></textarea>
                {errors.description && <span className="error">{errors.description}</span>}
            </label>
            <div className="button-group full-width">
                <button type="reset" className="border-button">Reset</button>
                <button type="submit" className="red-button">Submit</button>
            </div>
        </form>
    );
};

export default MovieForm;