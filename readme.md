# Welcome To Stage myList

## Overview

You are enhancing your OTT platform to include a new feature called "My List," which allows users to save their favourite movies and TV shows to a personalised list. This feature requires backend
services for managing the user's list, including adding, removing, and listing saved items.

## Objective
Implement the APIs for the “My List” feature on the backend so that any client (web or mobile apps) can easily consume these APIs to complete the feature. Ensure the solution is scalable, performant,
and includes integration tests.

## Technical Requirements- Used

1. Backend - Typescript with Express Js
2. Databse - MongoDB and MemCached
3. Testing - Jest , supertest cross-env
4. Deployment - I prefer google cloud run for node js, but as this app includes memcached so docker is good
5. CI/CD - prefers Gitlab(currently learning along)


## run this application

### Requirements
1. linux based platform needed. Use WSL Ubuntu in windows.
2. use sudo apt-get install memcached to install memcached

Clone this repo 

### run npm install
install all dependency

### npm test
run all test cases for 3 endpoints.

### npm start
start the server

1. Basic Authentication is present. use 'suman' as username and 'mypass' for password

## Explanation

This app has 1 endpoint - /favorite
which includes three method

1. GET /favorite/userId

   - provide mongodb ObjectId as String to replace userId

3. PUT /favorite

   - 3 required query parameters - userId, contentId & type
   - userId - mongodb objectId of user
   - contentId - Movies or TvShow objectId
   - type - either 'Movie' or 'TvShow'

5. DELETE /favorite
   
   - 2 reuired query parameters - userId, id
   - id - item's id to be deleted
   - userId - mongodb objectId of user
 

## Solution - Implementation

### from content I mean Tvshow or Movie

1. Made this service independent so if any other service go down it will not affect this service except Database.
2. Single responsiblity - This service is only responsible for managing user's List.
3. memcached is used to decrease server latency and minimize database hits. This will greatly enhance UX.
4. Test cases are included.
5. this service maintained it's own collection to resolve Many to Many relationship between content and User. The name of collection is 'favorites'
   
## Features

1. After every addition & deletion of item, latency of my list is maintained
2. full fetch user's list is done once per memcached session (3600s).
3. In those 3600s between memcached is in sync with mongodb. so to reduce database hits and reads/writes.

## Assumptions

1. As using mongodb database is same. I mean collection created by this service is inside the same database.
2. tvShows and Movies are two diffrent collection.




