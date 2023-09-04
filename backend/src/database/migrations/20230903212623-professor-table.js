"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("professores", {
			idProfessor: {
				primaryKey: true,
				autoIncrement: true,
				type: Sequelize.INTEGER,
			},
			nome: {
				type: Sequelize.STRING(150),
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING(255),
				allowNull: false,
				unique: true,
			},
			login: {
				type: Sequelize.STRING(30),
				unique: true,
				allowNull: false,
			},
			senha: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable("professores", {});
	},
};
