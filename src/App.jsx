/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

function getFilteredProducts(
  listOfProducts,
  personFilter = 'all',
  { query },
  categories = [],
) {
  let preparedProducts = [...listOfProducts];
  const normalizedQuery = query.trim().toLowerCase();
  const hasCategories = categories.length > 0;
  const hasQuery = normalizedQuery !== '';
  const isPersonFilterAll = personFilter === 'all';

  preparedProducts = preparedProducts.filter((product) => {
    const {
      user: { name },
      category: { title },
    } = product;

    if (!isPersonFilterAll && name !== personFilter) {
      return false;
    }

    if (hasQuery && !product.name.toLowerCase().includes(normalizedQuery)) {
      return false;
    }

    if (hasCategories && !categories.includes(title)) {
      return false;
    }

    return true;
  });

  return preparedProducts;
}

export const App = () => {
  const [personFilter, setPersonFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const filteredProducts = getFilteredProducts(
    products,
    personFilter,
    {
      query,
    },
    categoryFilter,
  );

  const handleReset = () => {
    setQuery('');
    setPersonFilter('all');
    setCategoryFilter([]);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter((prev) => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      }

      return [...prev, value];
    });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': personFilter === 'all',
                })}
                onClick={() => setPersonFilter('all')}
              >
                All
              </a>
              {usersFromServer.map((user) => {
                const isSelectedPerson = personFilter === user.name;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={user.id}
                    className={cn({
                      'is-active': isSelectedPerson,
                    })}
                    onClick={() => setPersonFilter(user.name)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': categoryFilter.length !== 0,
                })}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': categoryFilter.includes(category.title),
                  })}
                  href="#/"
                  onClick={() => handleCategoryFilter(category.title)}
                  key={category.id}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(item => (
                  <tr data-cy="Product" key={item.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {item.id}
                    </td>

                    <td data-cy="ProductName">{item.name}</td>
                    <td data-cy="ProductCategory">
                      {`${item.category.icon} - ${item.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        item.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {item.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
