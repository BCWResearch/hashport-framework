import {
    SelectionFilterContext,
    SelectionFilterDispatchContext,
} from 'contexts/selectionFilterContext';
import { useContext } from 'react';

export const useSelectionFilters = () => {
    const selectionFilters = useContext(SelectionFilterContext);
    if (!selectionFilters) throw 'Must use selection filters within context';
    return selectionFilters;
};

export const useSelectionFilterDispatch = () => {
    const filterDispatch = useContext(SelectionFilterDispatchContext);
    if (!filterDispatch) throw 'Must use filter dispatch within context';
    return filterDispatch;
};
