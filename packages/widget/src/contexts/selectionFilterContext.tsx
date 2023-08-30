import { Reducer, createContext, useMemo, useReducer } from 'react';

type SelectionFilterState = {
    searchString: string;
    filters: { key: string; value: unknown }[];
    disabledFilters: { key: string; value: unknown }[];
};

type SelectionFilterAction =
    | { type: 'updateSearchString'; payload: string }
    // TODO: rework these other filters. might need different kind of state
    | { type: 'addFilter'; payload: { key: string; value: unknown } }
    | { type: 'removeFilter'; payload: { key: string; value: unknown } };

type SelectionFilterDispatch = {
    [Action in SelectionFilterAction as Action['type']]: (payload: Action['payload']) => void;
};

const filterReducer: Reducer<SelectionFilterState, SelectionFilterAction> = (
    state,
    { type, payload },
) => {
    switch (type) {
        case 'updateSearchString': {
            return {
                ...state,
                searchString: payload.toLowerCase(),
            };
        }
        case 'removeFilter':
        case 'addFilter': {
            // TODO: handle adding filter logic
            return state;
        }
    }
};

export const SelectionFilterContext = createContext<SelectionFilterState | null>(null);

export const SelectionFilterDispatchContext = createContext<SelectionFilterDispatch | null>(null);

const selectionFilterStateInit: SelectionFilterState = {
    searchString: '',
    filters: [],
    disabledFilters: [],
};

export const SelectionFilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [filterState, filterDispatch] = useReducer(filterReducer, selectionFilterStateInit);
    const dispatch: SelectionFilterDispatch = useMemo(
        () => ({
            updateSearchString: payload => filterDispatch({ type: 'updateSearchString', payload }),
            addFilter: payload => filterDispatch({ type: 'addFilter', payload }),
            removeFilter: payload => filterDispatch({ type: 'removeFilter', payload }),
        }),
        [filterDispatch],
    );
    return (
        <SelectionFilterContext.Provider value={filterState}>
            <SelectionFilterDispatchContext.Provider value={dispatch}>
                {children}
            </SelectionFilterDispatchContext.Provider>
        </SelectionFilterContext.Provider>
    );
};
