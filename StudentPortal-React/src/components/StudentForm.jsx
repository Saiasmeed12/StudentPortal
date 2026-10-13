
function StudentForm({
  formData,
  editingStudentId,
  loading,
  onChange,
  onSubmit,
  onCancel
}) {
  return (
    <section className="card student-form">
      <h3>
        {editingStudentId !== null
          ? `Update Student (ID: ${editingStudentId})`
          : 'Add New Student'}
      </h3>

      <form onSubmit={onSubmit}>
        <label htmlFor="fname">First Name</label>
        <input
          id="fname"
          name="fname"
          value={formData.fname}
          onChange={onChange}
          required
        />

        <label htmlFor="lname">Last Name</label>
        <input
          id="lname"
          name="lname"
          value={formData.lname}
          onChange={onChange}
          required
        />

        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          min="1"
          value={formData.age}
          onChange={onChange}
          required
        />

        <label htmlFor="total_marks">Total Marks</label>
        <input
          id="total_marks"
          name="total_marks"
          type="number"
          min="0"
          value={formData.total_marks}
          onChange={onChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? 'Saving...'
            : editingStudentId !== null
              ? 'Update Student'
              : 'Save Student'}
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </section>
  )
}

export default StudentForm
