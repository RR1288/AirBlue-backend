"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Users", {
            UserID: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            UserName: { type: Sequelize.STRING(20)},
            FName: { type: Sequelize.STRING(50), allowNull: false },
            LName: { type: Sequelize.STRING(50), allowNull: false },
            City: { type: Sequelize.STRING(85) },
            State: { type: Sequelize.CHAR(2) },
            Country: { type: Sequelize.STRING(56), allowNull: false },
            Email: { type: Sequelize.STRING(320), unique: true, allowNull: false },
            KTN: { type: Sequelize.STRING(10), unique: true },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            deletedAt: {type: Sequelize.DATE , defaultValue: null}
        });
    },
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION log_changes()
      RETURNS TRIGGER AS $$
      BEGIN
        -- For INSERT operation
        IF (TG_OP = 'INSERT') THEN
          INSERT INTO audit_log (TableName, operation, ChangedBy, NewData)
          VALUES (TG_TABLE_NAME, TG_OP, current_user, row_to_json(NEW)::jsonb);
          RETURN NEW;

        -- For DELETE operation
        ELSIF (TG_OP = 'DELETE') THEN
          INSERT INTO audit_log (TableName, operation, ChangedBy, OldData)
          VALUES (TG_TABLE_NAME, TG_OP, current_user, row_to_json(OLD)::jsonb);
          RETURN OLD;

        -- For UPDATE operation
        ELSIF (TG_OP = 'UPDATE') THEN
          INSERT INTO audit_log (TableName, operation, ChangedBy, OldData, NewData)
          VALUES (TG_TABLE_NAME, TG_OP, current_user, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
          RETURN NEW;
        END IF;

        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);
        await queryInterface.sequelize.query(`
      CREATE TRIGGER users_audit_trigger
      AFTER INSERT OR UPDATE OR DELETE ON "Users"
      FOR EACH ROW
      EXECUTE FUNCTION log_changes();
    `);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Users");
        await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS users_audit_trigger ON "Users";
    `);

        await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS log_changes;
    `);
    },

};