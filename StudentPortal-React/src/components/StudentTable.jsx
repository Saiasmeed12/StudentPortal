
function StudentTable({
  students,
  loadingStudents,
  listError,
  onEdit,
  onDelete,
  onClose
}) {
  return (
    <section className="card student-list">
      <h3>All Students</h3>

      {loadingStudents && <p>Loading students...</p>}

      {listError && (
        <p className="error-message">{listError}</p>
      )}

      {!loadingStudents && !listError && (
        students.length === 0 ? (
          <p>No students found. Add your first student!</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                  <th>Total Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map(student => (
                  <tr key={student.sid}>
                    <td>{student.sid}</td>
                    <td>{student.fname}</td>
                    <td>{student.lname}</td>
                    <td>{student.age}</td>
                    <td>{student.total_marks}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => onEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => onDelete(student)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <button
        className="cancel-btn"
        onClick={onClose}
      >
        Close Student List
      </button>
    </section>
  )
}

export default StudentTable
