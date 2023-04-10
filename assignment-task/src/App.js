import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentPage: 1,
      totalPages: 0,
      searchQuery: '',
    };
  }

  componentDidMount() {
    this.loadProducts();
  }

  loadProducts = (page = 1, searchQuery = '') => {
    let url = `https://dummyjson.com/products?page=${page}&limit=10`;
    if (searchQuery) {
      url = `https://dummyjson.com/products/search?q=${searchQuery}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({
          products: data.data,
          currentPage: data.page,
          totalPages: data.total_pages,
          searchQuery,
        });
      });
  };

  handleSearch = query => {
    this.loadProducts(1, query);
  };

  handlePageChange = page => {
    this.loadProducts(page, this.state.searchQuery);
  };

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <h1>Product List</h1>
              <SearchBox onSearch={this.handleSearch} />
              <ProductList
                products={this.state.products}
                currentPage={this.state.currentPage}
                totalPages={this.state.totalPages}
                onPageChange={this.handlePageChange}
              />
            </Route>
            <Route path="/products/:id">
              <ProductDetail />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

function SearchBox(props) {
  const [query, setQuery] = React.useState('');

  const handleChange = event => {
    setQuery(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    props.onSearch(query);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input type="text" placeholder="Search products" value={query} onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
}

function ProductList(props) {
  const { products, currentPage, totalPages, onPageChange } = props;

  return (
    <div className="product-list">
      {products.map(product => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Price: {product.price}</p>
          <Link to={`/products/${product.id}`}>View Details</Link>
        </div>
      ))}

      {totalPages > 1 && (
        <Pagination current={currentPage} total={totalPages} onChange={onPageChange} />
      )}
    </div>
  );
}

function Pagination(props) {
  const { current, total, onChange } = props;
  const pages = [];

  for (let i = 1; i <= total; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map(page => (
        <button
          key={page}
          className={current === page ? 'active' : ''}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      product:null
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    fetch(`https://dummyjson.com/products/${id}`)
    .then(res => res.json())
    .then(data => {
    this.setState({
    product: data,
    });
    });
    }
    render() {
      const { product } = this.state;
      
      if (!product) {
        return <div>Loading...</div>;
      }
      
      return (
        <div className="product-detail">
          <img src={product.image} alt={product.name} />
          <h1>{product.name}</h1>
          <p>Price: {product.price}</p>
          <p>Description: {product.description}</p>
        </div>
      );
    }
  } 

  export default App;
