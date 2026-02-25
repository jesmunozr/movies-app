import React from 'react';

const Genre = ({genreList, selectedGenre, onSelect}) => {

    const genresWithPlaceholder = ["", ...genreList];

    const genreContainer = React.createElement("div", null,
        React.createElement("label", { htmlFor: "genre-select" }, "Genre"),
        React.createElement("select", 
            { 
                id: "genre-select",
                value: selectedGenre,
                onChange: (event) => onSelect(event.target.value)
            },
            genresWithPlaceholder.map((genre) => {
                if (genre === "") {
                    return React.createElement("option", { key: "placeholder", value: "", hidden: true }, "Select Genre");
                }
                return React.createElement("option", { key: genre, value: genre }, genre);
            })
        )
    );

    return genreContainer;
};

export default Genre;