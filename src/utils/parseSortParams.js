// src/utils/parseSortParams.js

import { SORT_ORDER } from '../constants/index.js';

export const parseSortParams = (query) => {
  const { sortBy = 'name', sortOrder = SORT_ORDER.ASC } = query;

  return {
    field: sortBy,
    order:
      sortOrder.toLowerCase() === SORT_ORDER.DESC
        ? SORT_ORDER.DESC
        : SORT_ORDER.ASC,
  };
};
