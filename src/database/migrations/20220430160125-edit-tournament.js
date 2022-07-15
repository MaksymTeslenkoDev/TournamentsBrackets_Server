"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.addColumn("MatchCompetitors", "matchId", {
      //   type: Sequelize.INTEGER,
      // }),
      // queryInterface.addConstraint("MatchCompetitors", {
      //   fields: ["matchId"],
      //   type: "foreign key",
      //   name: "MatchCompetitors match_association",
      //   references: {
      //     table: "matches",
      //     field: "id",
      //   },
      //   onDelete: "CASCADE",
      // }),
      // queryInterface.removeConstraint(
      //   "MatchCompetitors",
      //   "Match_competitor competitors_association"
      // ),
      // queryInterface.addConstraint("MatchCompetitors", {
      //   fields: ["competitorId"],
      //   type: "foreign key",
      //   name: "Match_competitor competitors_association",
      //   references: {
      //     table: "competitors",
      //     field: "id",
      //   },
      //   onDelete: "CASCADE",
      // }),
      // queryInterface.changeColumn("MatchCompetitors", "competitorId", {
      //   type: Sequelize.INTEGER,
      //   type: "foreign key",
      //   onDelete: "CASCADE",
      // }),
      // queryInterface.removeColumn("tournaments", "description"),
      // queryInterface.removeColumn("tournaments", "signUpOpen"),
      // queryInterface.removeColumn("tournaments", "signUpEnd"),
      // queryInterface.addColumn("tournaments", "startAt", {
      //   type: Sequelize.STRING,
      // }),
      queryInterface.removeColumn("tournaments", "finishtAt"),
      queryInterface.addColumn("tournaments", "finishAt", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([]);
  },
};
