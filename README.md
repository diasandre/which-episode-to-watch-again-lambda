<img src="https://github.com/diasandre/which-episode-to-watch-again/blob/master/src/img/logo.png?raw=true"/>

# which-episode-to-watch-again-lambda
Lambda functions providing information to WETWA

## Requests

### Get random episode from tv show

`GET /random/{tvShowId}`

#### Response

{
"id": Long,
"tvShow": Long,
"title": String?
}

### Get tv shows

`GET /tv-shows/`

#### Response

[{
"id": Long,
"title": String
}]
