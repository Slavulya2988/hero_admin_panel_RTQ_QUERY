import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();
const initialState = heroesAdapter.getInitialState({heroesLoadingStatus: 'idle'});
// console.log(initialState);

export const heroesFetch = createAsyncThunk(
    'heroes/heroesFetch',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/heroes");
    }
)


const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroDelete: (state,action) => {
            // state.heroes = state.heroes.filter(item => item.id !== action.payload)
            heroesAdapter.removeOne(state, action.payload);
        },
        heroAdd: (state,action) =>{
            // state.heroes.push(action.payload);
            heroesAdapter.addOne(state, action.payload);
        }
    },
	 extraReducers: (builder) => {
		builder
			.addCase(heroesFetch.pending, state => {
				state.heroesLoadingStatus = 'loading' ;
		})
			.addCase(heroesFetch.fulfilled, (state,action) => {
				state.heroesLoadingStatus = 'idle';
				// state.heroes = action.payload;
                heroesAdapter.setAll(state, action.payload);
		})
			.addCase(heroesFetch.rejected, state => {
				state.heroesLoadingStatus = 'error';
		})
			.addDefaultCase(()=>{})
	 }
}) ;

const {actions, reducer} = heroesSlice;

export default reducer;

const { selectAll } = heroesAdapter.getSelectors(state => state.heroes)
export const filterHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (activeFilter, heroes) => {
        // console.log(heroes);
        if (activeFilter === 'all'){
              return heroes
        } else {
            return heroes.filter(item => item.element === activeFilter)
        }
    }
)


export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroDelete,
    heroAdd
} = actions;
