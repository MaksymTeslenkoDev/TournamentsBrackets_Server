"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.removeConstraint(
      //   "participants",
      //   "participants tournament_association"
      // ),
      // queryInterface.addColumn("MatchCompetitors", "matchId", {
      //   type: Sequelize.INTEGER,
      // }),
      // queryInterface.addConstraint("participants", {
      //   fields: ["tournament_id"],
      //   type: "foreign key",
      //   name: "participants tournament_association",
      //   references: {
      //     table: "tournaments",
      //     field: "id",
      //   },
      //   onDelete: "CASCADE",
      // }),
      // queryInterface.removeColumn("tournaments", "description"),
      // queryInterface.removeColumn("tournaments", "signUpOpen"),
      // queryInterface.removeColumn("tournaments", "signUpEnd"),
      // queryInterface.addColumn("tournaments", "startAt", {
      //   type: Sequelize.STRING,
      // }),
      // queryInterface.removeColumn("tournaments", "finishtAt"),
      queryInterface.addColumn("tournaments", "invite", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("tournaments", "password", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([]);
  },
};
