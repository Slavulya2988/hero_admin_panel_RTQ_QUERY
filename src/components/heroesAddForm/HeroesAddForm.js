import { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import { selectAll} from '../heroesFilters/filterSlice';

import { useCreateHeroMutation } from '../../api/apiSlice';


const HeroesAddForm = () => {

    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const [createHero, {isLoading}] = useCreateHeroMutation();

    const { filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const onSave = (e) => {
        e.preventDefault();
        if (heroName.length < 1 || heroDescr.length < 1 || heroElement.length < 1 ){
            return;
        } else{
            const newHero = {
                id: uuidv4(),
                name: heroName,
                description: heroDescr,
                element: heroElement
            }

           createHero(newHero).unwrap();

           setHeroName('');
           setHeroDescr('');
           setHeroElement('');
        }
    }

    const renderOptions = (filters, status) => {
        if (status === isLoading) {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <h5 className="text-center mt-5">Помилка завантаження</h5>
        }

        if (filters && filters.length > 0){
            return filters.map(({name, label}) => {
                // if (name === 'all')  return;
                return <option key={name} value={name}> {label} </option>;
            })
        }
    }

    const options = renderOptions(filters, filtersLoadingStatus);

    return (
        <form className="border p-4 shadow-lg rounded"
            onSubmit = {onSave}
            >
            <div  className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Ім'я нового героя</label>
                <input
                    required
                    autoComplete="on"
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Як мене звати?"
                    value = {heroName}
                    onChange = {(e) => setHeroName(e.target.value)}/>
            </div>

            <div  className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Опис</label>
                <textarea
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Що я вмію?"
                    style={{"height": '130px'}}
                    value = {heroDescr}
                    onChange = {(e) => setHeroDescr(e.target.value)}
                    />
            </div>

            <div  className="mb-3">
                <label htmlFor="element" className="form-label">Вибрати елемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value = {heroElement}
                    onChange = {(e) => setHeroElement(e.target.value)}>
                        {options}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Створити</button>
        </form>
    )
}

export default HeroesAddForm;
