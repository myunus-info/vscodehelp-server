// Start the application
exports.start = () => {
  const path = require('path');
  const app = require('./express')();
  const connectDB = require('./mongoose');
  const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));
  const DB = nodeCache.getValue('DATABASE').replace('<password>', nodeCache.getValue('DB_PASS'));

  connectDB(DB)
    .then(() => console.log('Database connected successfully!'))
    .then(() => {
      app.listen(app.get('port'), () => {
        console.log('Server is up on port %s in %s mode', app.get('port'), app.settings.env);
      });
    })
    .catch(err => console.log(`${err.name}: ${err.message}`));
};
