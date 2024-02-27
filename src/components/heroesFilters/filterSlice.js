import { createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';


const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
          filtersLoadingStatus: 'idle',
          activeFilter: 'all'
})

// console.log(initialState);
// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// };


export const filterFetch = createAsyncThunk(
    'filters/filterFetch',
    async () => {
       const {request} = useHttp();
       return await request("http://localhost:3001/filters")
    }
)

const filtersSlice =  createSlice({
    name: 'filters',
    initialState,
    reducers: {
         activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(filterFetch.pending, state => {state.filtersLoadingStatus = 'loading'; })
            .addCase(filterFetch.fulfilled, (state, action) => {
                //state.filters = action.payload;
                //console.log(action.payload);
                filterAdapter.setAll(state, action.payload);
                state.filtersLoadingStatus = 'idle';
            })
            .addCase(filterFetch.rejected, (state) => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }

});

const {actions, reducer} = filtersSlice;

export default reducer;
export const { selectAll } = filterAdapter.getSelectors(state => state.filters);

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;
