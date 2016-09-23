/* TODO */

/*
 * Application action creators
 */



import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const VISIBILITY_FILTERS = {
	SHOW_ALL: 'SHOW_ALL',
	SHOW_COMPLETED: 'SHOW_COMPLETED',
	SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

let nextTodoId = 0;

// add other actions from other apps

// Todo App actions

export function addTodo(text) { 
	return { 
		type: ADD_TODO,
		id: nextTodoId++,
		text
	}
}

export function toggleTodo(id) { 
	return {
		type: TOGGLE_TODO,
		id
	}
}


export function setVisibilityFilter(filter) { 
	return {
		type: SET_VISIBILITY_FILTER,
		filter
	}
}

// Subredit App actions

export function selectSubreddit(subreddit) {
	return {
		type: SELECT_SUBREDDIT,
		subreddit
	}
}

export function invalidateSubreddit(subreddit) {
	return {
    	type: INVALIDATE_SUBREDDIT,
    	subreddit
  	}
}

function requestPosts(subreddit) {
	return {
    	type: REQUEST_POSTS,
    	subreddit
  	}
}

function receivePosts(subreddit, json) {
	return {
    	type: RECEIVE_POSTS,
    	subreddit,
    	posts: json.data.children.map(child => child.data),
    	receivedAt: Date.now()
  	}
}

function fetchPosts(subreddit) {
  	return dispatch => {
    	dispatch(requestPosts(subreddit))
    	return fetch(`http://www.reddit.com/r/${subreddit}.json`)
    		.then(response => response.json())
      		.then(json => dispatch(receivePosts(subreddit, json)))
  	}
}

function shouldFetchPosts(state, subreddit) {
	const posts = state.subreddit.postsBySubreddit[subreddit]
	if (!posts) {
		return true
	} else if (posts.isFetching) {
		return false
	} else {
		return posts.didInvalidate
  	}
}

export function fetchPostsIfNeeded(subreddit) {
	return (dispatch, getState) => {
		if (shouldFetchPosts(getState(), subreddit)) {
    		return dispatch(fetchPosts(subreddit))
    	}
  	}
}