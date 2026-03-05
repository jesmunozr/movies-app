export const Sort = ({ sortBy, onSortChange }: { sortBy: string; onSortChange: (sortBy: string) => void }) => {
    return (
        <div>
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
                <option value="title">Title</option>
                <option value="releaseDate">Release Date</option>
            </select>
        </div>
    );
}
