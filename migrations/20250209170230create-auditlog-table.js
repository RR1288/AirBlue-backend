'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_log', {
      ID: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      TableName: { type: Sequelize.STRING(255), allowNull: false },
      Operation: { type: Sequelize.STRING(10), allowNull: false},
      ChangedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
      ChangedBy: { type: Sequelize.String, defaultValue: false, allowNull: false },
      OldData: {type: Sequelize.JSONB, allowNull: false },
      NewData: { type: Sequelize.JSONB, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Itineraries');
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
	await queryInterface.sequelize.query(`
  	CREATE OR REPLACE FUNCTION log_changes()
  	RETURNS TRIGGER AS $$
  	BEGIN
      	-- Log INSERT operation
      	IF (TG_OP = 'INSERT') THEN
          	INSERT INTO audit_log (tableName, operation, changedBy, newData)
          	VALUES (TG_TABLE_NAME, TG_OP, current_user, row_to_json(NEW)::jsonb);
          	RETURN NEW;
     	 
      	-- Log DELETE operation
      	ELSIF (TG_OP = 'DELETE') THEN
          	INSERT INTO audit_log (tableName, operation, changedBy, oldData)
          	VALUES (TG_TABLE_NAME, TG_OP, current_user, row_to_json(OLD)::jsonb);
          	RETURN OLD;
     	 
      	-- Log UPDATE operation
      	ELSIF (TG_OP = 'UPDATE') THEN
          	INSERT INTO audit_log (tableName, operation, changedBy, oldData, newData)
          	VALUES (TG_TABLE_NAME, TG_OP, current_user, row_to_json(OLD)::jsonb,
            row_to_json(NEW)::jsonb);
          	RETURN NEW;
      	END IF;
  	END;
  	$$ LANGUAGE plpgsql;
	`);

	await queryInterface.sequelize.query(`
  	CREATE TRIGGER TABLE_NAME_audit_trigger
  	AFTER INSERT OR UPDATE OR DELETE ON TABLE_NAME
  	FOR EACH ROW
  	EXECUTE FUNCTION log_changes();
	`);
  },  down: async (queryInterface, Sequelize) => 

{
	await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS TABLE_NAME_audit_trigger ON TABLE_NAME;`);
	await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS log_changes;`);
  }
};
