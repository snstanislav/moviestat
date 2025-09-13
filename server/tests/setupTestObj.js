const mongoose = require("mongoose");
const { UserItem } = require("../domain/UserItem");
const { PersonItem } = require("../domain/PersonItem");
const { MovieItem } = require("../domain/MovieItem");

function getTestUserObj() {
  const newTestUser = new UserItem();
  newTestUser.email = `test_${Date.now()}@domain.com`;
  newTestUser.login = `testUser_${Date.now()}`;
  newTestUser.password = "123456789";
  newTestUser.fullName = "John Doe";
  newTestUser.role = "admin";
  newTestUser.evals = [];

  return newTestUser;
}

function getTestPersonObj() {
  const newTestPerson = new PersonItem();
  newTestPerson.tmdbID = "5081";
  newTestPerson.imdbID = "nm1289434";
  newTestPerson.name = "Emily Blunt";
  newTestPerson.birthday = "1983-02-23";
  newTestPerson.placeOfBirth = "London";
  newTestPerson.gender = 1;
  newTestPerson.poster = "/some-posterlink/503150.jpg";
  newTestPerson.biography = "Some large text...."

  return newTestPerson;
}

module.exports = { getTestUserObj, getTestPersonObj };