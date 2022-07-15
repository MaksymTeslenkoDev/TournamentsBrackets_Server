"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addConstraint("participants", {
        fields: ["tournament_id"],
        type: "foreign key",
        name: "participants tournament_association",
        references: {
          table: "tournaments",
          field: "id",
        },
      }),
      queryInterface.addConstraint("participants", {
        fields: ["user_id"],
        type: "foreign key",
        name: "participants user_association",
        references: {
          table: "users",
          field: "id",
        },
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeConstraint(
        "participants",
        "Match_competitor match_association"
      ),
      queryInterface.removeConstraint(
        "MatchCompetitors",
        "Match_competitor competitors_association"
      ),
    ]);
  },
};
