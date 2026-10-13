
import { useState } from 'react'
import axios from 'axios'
import './App.css'

import Navbar from './components/Navbar'
import StudentTable from './components/StudentTable'
import StudentForm from './components/StudentForm'
import StudentSearch from './components/StudentSearch'

const API_URL = 'http://localhost:9091/student'

const emptyForm = {
  fname: '',
  lname: '',
  age: '',
  total_marks: ''
}

function App() {
  const [showForm, setShowForm] = useState(false)
  const [showStudents, setShowStudents] = useState(false)

  const [formData, setFormData] = useState(emptyForm)
  const [editingStudentId, setEditingStudentId] = useState(null)

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [listError, setListError] = useState('')

  const [searchType, setSearchType] = useState('id')
  const [searchValue, setSearchValue] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')


  async function loadStudents() {
    setLoadingStudents(true)
    setListError('')

    try {
      const response = await axios.get(
        `${API_URL}/getAllStudents`
      )
      setStudents(response.data)
    } catch (err) {
      console.error(err)
      setListError(
        'Unable to load students.'
      )
    } finally {
      setLoadingStudents(false)
    }
  }

  async function handleViewStudents() {
    setShowStudents(true)
    await loadStudents()
  }

  
  function handleChange(event) {
    const { name, value } = event.target

    setFormData(previous => ({
      ...previous,
      [name]: value
    }))
  }


  function handleEdit(student) {
    setEditingStudentId(student.sid)

    setFormData({
      fname: student.fname ?? '',
      lname: student.lname ?? '',
      age: student.age ?? '',
      total_marks: student.total_marks ?? ''
    })

    setError('')
    setMessage('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingStudentId(null)
    setFormData({ ...emptyForm })
  }

  
  async function handleSubmit(event) {
    event.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {
      const student = {
        fname: formData.fname.trim(),
        lname: formData.lname.trim(),
        age: Number(formData.age),
        total_marks: Number(formData.total_marks)
      }

    
      if (
        !student.fname ||
        !student.lname ||
        formData.age === '' ||
        formData.total_marks === '' ||
        !Number.isFinite(student.age) ||
        !Number.isFinite(student.total_marks) ||
        student.age < 1 ||
        student.total_marks < 0
      ) {
        setError('Enter valid values in all fields.')
        return
      }

      if (editingStudentId !== null) {
  
        await axios.put(
          `${API_URL}/update/${editingStudentId}`,
          student
        )

        setMessage(
          `Student ID ${editingStudentId} updated successfully!`
        )
      } else {
    
        const response = await axios.post(
          `${API_URL}/studata`,
          student
        )

        setMessage(
          `Student ${response.data.fname} saved successfully!`
        )
      }

      closeForm()

      if (showStudents) {
        await loadStudents()
      }

    
      if (
        searchResult &&
        (
          editingStudentId === searchResult.sid ||
          editingStudentId === null
        ) &&
        searchValue.trim()
      ) {
        await searchStudent(
          searchValue.trim(),
          searchType
        )
      }
    } catch (err) {
      console.error(err)

      setError(
        err.response
          ? `Request failed with status ${err.response.status}. Check backend logs.`
          : 'Cannot connect to Spring Boot.'
      )
    } finally {
      setLoading(false)
    }
  }


  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.fname} ${student.lname} (ID: ${student.sid})?`
    )

    if (!confirmed) return

    setMessage('')
    setError('')

    try {
      await axios.delete(
        `${API_URL}/delete/${student.sid}`
      )

      setMessage(
        `Student ID ${student.sid} deleted successfully!`
      )

      if (searchResult?.sid === student.sid) {
        setSearchResult(null)
      }

      if (showStudents) {
        await loadStudents()
      }
    } catch (err) {
      console.error(err)

      setError(
        err.response
          ? `Delete failed with status ${err.response.status}.`
          : 'Cannot connect to Spring Boot.'
      )
    }
  }

  async function searchStudent(value, type) {
    setSearchResult(null)
    setSearchError('')
    setSearchLoading(true)

    try {
      const endpoint =
        type === 'id'
          ? `${API_URL}/gs/${encodeURIComponent(value)}`
          : `${API_URL}/getStudent/fname/${encodeURIComponent(value)}`

      const response = await axios.get(endpoint)

      if (response.data) {
        setSearchResult(response.data)
      } else {
        setSearchError('No student found.')
      }
    } catch (err) {
      console.error(err)

      if (err.response?.status === 404) {
        setSearchError('Student not found.')
      } else {
        setSearchError(
          'Search failed. Check the entered value and backend.'
        )
      }
    } finally {
      setSearchLoading(false)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()

    const value = searchValue.trim()

    if (!value) {
      setSearchError(
        'Enter a student ID or first name.'
      )
      return
    }

    if (
      searchType === 'id' &&
      (!/^\d+$/.test(value) || Number(value) < 1)
    ) {
      setSearchError(
        'Enter a valid positive student ID.'
      )
      return
    }

    await searchStudent(value, searchType)
  }

  return (
    <div className="app">

     
      <Navbar />

      <main className="container">
        <div className="page-heading">
          <h1>Welcome to Student Portal📚 </h1>
           <h3>Manage your student records in one place.</h3>
       </div>
     
        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        <div className="dashboard">
          <div className="card">
            <h3>View Students</h3>
            <p>View all registered students.</p>

            <button onClick={handleViewStudents}>
              View Students
            </button>
          </div>

          <div className="card">
            <h3>Add Student</h3>
            <p>Register a new student.</p>

            <button
              onClick={() => {
                closeForm()
                setError('')
                setMessage('')
                setShowForm(true)
              }}
            >
              Add Student
            </button>
          </div>
        </div>

       
        <StudentSearch
          searchType={searchType}
          searchValue={searchValue}
          searchResult={searchResult}
          searchLoading={searchLoading}
          searchError={searchError}
          onTypeChange={event => {
            setSearchType(event.target.value)
            setSearchValue('')
            setSearchResult(null)
            setSearchError('')
          }}
          onValueChange={event =>
            setSearchValue(event.target.value)
          }
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        
        {showStudents && (
          <StudentTable
            students={students}
            loadingStudents={loadingStudents}
            listError={listError}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={() => setShowStudents(false)}
          />
        )}

        
        {showForm && (
          <StudentForm
            formData={formData}
            editingStudentId={editingStudentId}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}
      </main>
    </div>
  )
}

export default App
