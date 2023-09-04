"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("turmas", {
			idTurma: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			idSerie: {
				type: Sequelize.STRING(3),
				allowNull: false,
				values: ["EF1", "EF2", "EF3", "EF4", "EF5", "EF6", "EF7", "EF8", "EF9", "EM1", "EM2", "EM3"],
			},
			idEscola: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "escolas",
					key: "idEscola",
				},
			},
			nome: {
				type: Sequelize.STRING(15),
				allowNull: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("turmas");
	},
};
