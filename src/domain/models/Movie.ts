export interface Movie {
    /** The URL of the movie poster image */
    imageUrl?: string;
    /** The title of the movie */
    title?: string;
    /** The release date of the movie */
    releaseDate?: Date;
    /** The genres of the movie */
    genres?: Array<MovieGenre>;
    /** The duration of the movie in minutes */
    duration?: number;
    /** The description of the movie */
    description?: string;
    /** The rating of the movie */
    rating?: number;
    /** The unique identifier of the movie */
    id?:number;
};

export interface MovieGenre {
    /** The value of the genre, e.g., "action", "comedy", etc. */
    value: string;
    /** The label of the genre, e.g., "Action", "Comedy", etc. */
    label: string;
};