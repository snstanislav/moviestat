const mongoose = require("mongoose");
const UserItem = require("../domain/UserItem");
const PersonItem = require("../domain/PersonItem");

function getTestUserObj() {
  const newTestUser = new UserItem({
    email: `test_${Date.now()}@domain.com`,
    login: `testUser_${Date.now()}`,
    password: "123456789",
    fullName: "John Doe",
    role: "admin",
    evals: []
  });
  return newTestUser;
}

function getTestPersonObj() {
  const newTestPerson = new PersonItem({
    tmdbID: "5081",
    imdbID: "nm1289434",
    name: "Emily Blunt",
    birthday: "1983-02-23",
    placeOfBirth: "London",
    gender: 1,
    poster: "/some-posterlink/503150.jpg",
    biography: "Some large text...."
  });
  return newTestPerson;
}

module.exports = { getTestUserObj, getTestPersonObj };