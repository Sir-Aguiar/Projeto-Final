"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("escolas", {
			idEscola: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			idProfessor: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "professores",
					key: "idProfessor",
				},
			},
			nome: {
				type: Sequelize.STRING(150),
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
		await queryInterface.dropTable("escolas");
	},
};
