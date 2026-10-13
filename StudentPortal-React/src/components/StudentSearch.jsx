
function StudentSearch({
  searchType,
  searchValue,
  searchResult,
  searchLoading,
  searchError,
  onTypeChange,
  onValueChange,
  onSearch,
  onEdit,
  onDelete
}) {
  return (
    <section className="card search-card">
      <h3>Search Students</h3>
      <p>Find a student using their ID or first name.</p>

      <form onSubmit={onSearch}>
        <label htmlFor="searchType">Search by</label>

        <select
          id="searchType"
          value={searchType}
          onChange={onTypeChange}
        >
          <option value="id">Student ID</option>
          <option value="fname">First Name</option>
        </select>

        <label htmlFor="searchValue">
          {searchType === 'id' ? 'Student ID' : 'First Name'}
        </label>

        <input
          id="searchValue"
          type={searchType === 'id' ? 'number' : 'text'}
          min={searchType === 'id' ? '1' : undefined}
          value={searchValue}
          onChange={onValueChange}
          placeholder={
            searchType === 'id'
              ? 'Enter student ID'
              : 'Enter first name'
          }
          required
        />

        <button type="submit" disabled={searchLoading}>
          {searchLoading ? 'Searching...' : 'Search Student'}
        </button>
      </form>

      {searchError && (
        <p className="error-message">{searchError}</p>
      )}

      {searchResult && (
        <div className="search-result">
          <h4>Student Found</h4>

          <p><strong>ID:</strong> {searchResult.sid}</p>
          <p><strong>First Name:</strong> {searchResult.fname}</p>
          <p><strong>Last Name:</strong> {searchResult.lname}</p>
          <p><strong>Age:</strong> {searchResult.age}</p>
          <p><strong>Total Marks:</strong> {searchResult.total_marks}</p>

          <div className="action-buttons">
            <button onClick={() => onEdit(searchResult)}>
              Edit Student
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(searchResult)}
            >
              Delete Student
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentSearch
