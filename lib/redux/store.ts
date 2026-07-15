import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './slice/modal-slice'

export const store = configureStore({
    reducer: {
        modal: modalReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 100, // Warn only if it takes more than 100 ms
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch