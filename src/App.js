import React, { Component } from 'react';
import axios from "axios";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

// import SearchInput from './components/SearchInput'
import './App.css';
import SearchResult from './components/SearchResult';


// var axiosTest = axios.get('https://api.github.com/repos/regfe89/keyboardnoble').data.forks_url;
// const axiosTest = async () => {
//   try {
//     const preResult = await axios.get('https://api.github.com/repos/regfe89/keyboardnoble');
//     console.log('inside', preResult.data.id);
//     this.setState({ axios: preResult.data.id })
//   } catch (error) {
//     console.error(error);
//   }
// }
// const axiosResult = async () => {
//   return await Promise axiosTest()
// }




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      querie: '',
      search: '',
      result: '',
      result2: [],
      seriesChecked: true,
      authorChecked: true,
      bookChecked: true,
      genreChecked: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
  }

  handleChange(event) {
    this.setState({ querie: event.target.value });
  }

  handleChecked(event) {
    switch (event.target.name) {
      case 'series':
        this.setState({ seriesChecked: !this.state.seriesChecked });
        break;
      case 'author':
        this.setState({ authorChecked: !this.state.authorChecked });
        break;
      case 'book':
        this.setState({ bookChecked: !this.state.bookChecked });
        break;
      case 'genre':
        this.setState({ genreChecked: !this.state.genreChecked });
        break;
    }
  }


  handleSearch() {
    // this.setState({ search: this.state.value });
    // &chs=on
    let preQuerie = this.state.querie.replace(/ /g, "+");
    if (this.state.seriesChecked) {
      preQuerie = preQuerie + '&chs=on'
    }
    if (this.state.authorChecked) {
      preQuerie = preQuerie + '&cha=on'
    }
    if (this.state.bookChecked) {
      preQuerie = preQuerie + '&chb=on'
    }
    if (this.state.genreChecked) {
      preQuerie = preQuerie + '&chg=on'
    }
    const searchQuerie = 'https://flibustasearch.herokuapp.com/http://flibusta.is/booksearch?ask=' + preQuerie;
    axios.get(searchQuerie).then(response => { this.setState({ result: response.data }, () => this.refineResult()) })
  }

  refineResult() {
    const result0 = String(this.state.result);
    const result1 = result0.substring(this.state.result.indexOf('<h1 class="title">Поиск книг</h1>') + 0);
    const result2 = result1.substring(0, result1.indexOf('<div id="sidebar-right" class="sidebar">'));
    const array1 = result2.split('\n');
    const array2 = array1.filter(String);
    const array3 = array2.filter(elem => {
      if (elem.includes('h1 class="title"')) { return false };
      if (elem.includes('input type=submit value')) { return false };
      if (elem.includes('<input type="checkbox"')) { return false };
      if (elem.includes('<a href="http://fbsearch.ru">')) { return false };
      // if (elem.includes('</form><hr><br><div class="item-list"><ul class="pager">')) { return false };
      return true;
    });

    const array5 = array3.map((elem, index) => {

      if (elem.includes('<li class="pager-current first">')) {
        elem = elem.substr(35)
      };

      if (elem.includes('<li class="pager-')) {
        elem = ReactHtmlParser(elem)
      };

      return (
        elem
      )
    })

    // let doc = new DOMParser().parseFromString('<div><b>Hello!</b></div>', 'text/html');
    this.setState({ result2: array5 });
  }

  render() {

    return (
      <div className='App'>
        <input placeholder='Enter book name' type="text" value={this.state.value} onChange={this.handleChange} />

        {/* <SearchInput
          placeholder='Enter book name' /> */}
        <button onClick={this.handleSearch}>Search</button>
        <div>
          <input type="checkbox" name="series" value="newsletter" onChange={this.handleChecked} checked={this.state.seriesChecked} /><label>Серии</label>
        </div>
        <div>
          <input type="checkbox" name="author" value="newsletter" onChange={this.handleChecked} checked={this.state.authorChecked} /><label>Авторы</label>
        </div>
        <div>
          <input type="checkbox" name="book" value="newsletter" onChange={this.handleChecked} checked={this.state.bookChecked} /><label>Книги</label>
        </div>
        <div>
          <input type="checkbox" name="genre" value="newsletter" onChange={this.handleChecked} checked={this.state.genreChecked} /><label>Жанры</label>
        </div>
        <div>
          {this.state.result2.map((result, index) => {
            return (
              <div key={index}>
                <SearchResult
                  result={result}
                />
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
// export { querie }

// {this.props.checks.map((check, index) => {
//   return (
//     <div key={check.id}>
//       <Link to={'/OldCheck'} >
//         <button className="CheckList" onClick={() => this.passOldCheckIndex(index)}>
//           <ChecksList date={this.props.checks[index].date.toLocaleString('ru-RU')} />
//         </button>
//       </Link>
//     </div>
//   );
// })}