import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import "./Search.css";
import * as actionTypes from "../../store/actionTypes";
import { searchUrl } from "../../assets/apiConfig";
import movieRatingColorize from "../../assets/movieRatingColorize";
import SearchItem from "./SearchItem";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      findedMovies: []
    };
  }

  searchForMoviesHandler = e => {
    const searchWord = e.target.value;
    this.getMovie(searchWord);
  };

  getMovie = searchWord => {
    axios(searchUrl(searchWord))
      .then(response => {
        const moviesArr = response.data.results;
        moviesArr.filter(movie => movie);
        this.setState((prevState, currState) => {
          return { findedMovies: moviesArr };
        });
      })
      .catch(err => console.log(err));
  };

  wantToWatchHandler = id => {
    const targetMovie = this.state.findedMovies.find(movie => movie.id === id);
    const filteredFinded = this.state.findedMovies.filter(
      movie => movie.id !== id
    );
    this.props.wantToWatchHandlerRED(targetMovie);
    this.setState((prevState, currState) => {
      return {
        findedMovies: filteredFinded
      };
    });
  };

  userRatingHandler = (note, id) => {
    const ratedMovie = this.state.findedMovies.find(movie => movie.id === id);
    ratedMovie.my_note = note;
    const filteredFinded = this.state.findedMovies.filter(
      movie => movie.id !== id
    );
    this.setState((prevState, nextProps) => {
      return {
        findedMovies: [...filteredFinded]
      };
    });
    this.props.userRatingHandlerRED(ratedMovie);
  };

  render() {
    const { findedMovies } = this.state;

    const moviesListItems = findedMovies.map(movie => {
      const {
        id,
        poster_path,
        original_title,
        release_date,
        overview,
        vote_average
      } = movie;

      const noteBackground = movieRatingColorize(vote_average);

      return (
        <SearchItem
          noteBackground={noteBackground}
          key={id}
          id={id}
          poster_path={poster_path}
          original_title={original_title}
          release_date={release_date}
          overview={overview}
          userRatingHandler={(note, id) => this.userRatingHandler(note, id)}
          wantToWatchHandler={id => this.wantToWatchHandler(id)}
        />
      );
    });

    return (
      <div className="search">
        <h3 className="search__section-title">Search for Your Movies</h3>
        <input
          className="search__input"
          onChange={this.searchForMoviesHandler}
          type="search"
          placeholder="Search now..."
        />
        <div className="search__list-wrapper">
          <ul className="search__finded-list">{moviesListItems}</ul>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userRatingHandlerRED: movieObj =>
      dispatch({ type: actionTypes.USER_RATING_FROM_SEARCH, movie: movieObj }),
    wantToWatchHandlerRED: movieObj =>
      dispatch({ type: actionTypes.ADD_TO_WANT_FROM_SEARCH, movie: movieObj })
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Search);
