import { configureStore } from '@reduxjs/toolkit'

import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filterSlice';

// const enhancer = (createStore) => (...args) => {
//     const store = createStore(...args);

//     const oldDispatch = store.dispatch;
//     store.dispatch = (action) => {
//         if (typeof action === 'string') {
//             return oldDispatch({
//                 type: action
//             })
//         }
//         return oldDispatch(action)
//     }
//     return store;
// }


const stringMiddleware = () => (next) => (action) => {
        if (typeof action === 'string') {
            return next({
                type: action
            })
        }
        return next(action)
}
//configureStore from Redux Toolkit
// 1. импорт configureStore  із toolkit
// 2. створюємо хранилище з наступними параметрами:
//  reducer - об'єкт із усіх редьюсеров
//  middleware - берем внутренную функцію редикс-тулкіт getDefaultMiddleware и присоединям наш /middleware
//  devTools - подключаем со значение True только для режима розробки

const store = configureStore({
    reducer: {heroes, filters},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'
})

// const store = createStore(
//                     combineReducers({heroes, filters}),
//                     compose(
//                        applyMiddleware(thunk,stringMiddleware),
//                         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                     )

//                     );

export default store;
