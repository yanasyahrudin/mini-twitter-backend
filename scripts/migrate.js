import sequelize from '../config/database.js';

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    
    await sequelize.authenticate();
    console.log('Database connection established');

    // Sync all models (create tables)
    await sequelize.sync({ force: false, alter: true });
    console.log('All models synchronized');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
