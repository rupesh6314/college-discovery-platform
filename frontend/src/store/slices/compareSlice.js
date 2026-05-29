import { createSlice } from '@reduxjs/toolkit'

const compareSlice = createSlice({
  name: 'compare',
  initialState: { colleges: [], maxColleges: 20 },
  reducers: {
    addCollege: (state, action) => {
      if (state.colleges.length < 20 && !state.colleges.find(c => c.id === action.payload.id)) {
        state.colleges.push(action.payload)
      }
    },
    removeCollege: (state, action) => {
      state.colleges = state.colleges.filter(c => c.id !== action.payload)
    },
    clearColleges: (state) => {
      state.colleges = []
    },
    setColleges: (state, action) => {
      state.colleges = action.payload
    }
  }
})

export const { addCollege, removeCollege, clearColleges, setColleges } = compareSlice.actions
export default compareSlice.reducer