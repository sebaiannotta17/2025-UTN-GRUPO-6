var bearer = '';

function getToken() {
	$.ajax({
		url: 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/oauth2/token',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'Authorization': 'Basic ' + btoa('xccczcS1knS3wIKNhQBBR4zSC:zojPpCNxl1ryr5N1gQfAqLVOl5DH5e6yivkJfWxa451GoS0lft')
		},
		data: {
			grant_type: 'client_credentials'
		},
		success: function(response) {
			bearer = response.access_token;
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}

function getTweets() {
	$.ajax({
		url: 'https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=tygweb',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + bearer
		},
		success: function(response) {
			console.log(response);
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}

function getPosts() {
	$.ajax({
		url: 'https://jsonplaceholder.typicode.com/posts',
		method: 'GET',
		success: function(response) {
			console.log(response);
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}

function createPost() {
	$.ajax({
		url: 'https://jsonplaceholder.typicode.com/posts',
		method: 'POST',
		data: {
			title: 'Mi post',
			body: 'Post de ejemplo',
			userId: 1
		},
		success: function(response) {
			console.log(response);
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}

function updatePost() {
	$.ajax({
		url: 'https://jsonplaceholder.typicode.com/posts/1',
		method: 'PUT',
		data: {
			id: 1,
			title: 'Mi post!',
			body: 'Post de ejemplo!',
			userId: 1
		},
		success: function(response) {
			console.log(response);
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}

function deletePost() {
	$.ajax({
		url: 'https://jsonplaceholder.typicode.com/posts/1',
		method: 'DELETE',
		success: function(response) {
			console.log(response);
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}

function getPost() {
	$.ajax({
		url: 'https://jsonplaceholder.typicode.com/posts/1',
		method: 'GET',
		success: function(response) {
			console.log(response);
		},
		error: function(req, status, err) {
			console.log(req, status, err);
		}
	});
}