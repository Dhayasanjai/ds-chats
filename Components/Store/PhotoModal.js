import { configureStore, createSlice } from '@reduxjs/toolkit';
const initialState = {
  url: '',
  showModal: false,
  id: '',
};

const photoModal = createSlice({
  name: 'photoModal',
  initialState,
  reducers: {
    setShowModalHandler(state, action) {
      state.url = action.payload.url;
      state.showModal = action.payload.showModal;
      state.id = action.payload.id;
    },
  },
});

const photoReducers = photoModal.reducer;
export const photoActions = photoModal.actions;

const store = configureStore({ reducer: photoReducers });
export default store;
