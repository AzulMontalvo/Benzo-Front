//SearchBar.jsx
const SearchBar = ({searchTerm, setSearchTerm}) => {

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Buscando:", e.target.value);
  };

  return (
    <>
      <button type="submit" className="search-button">
        <i className="bi bi-search"></i>
      </button>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
    </>
  );
};

export default SearchBar;


//////