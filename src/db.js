import NodeCouchDb from 'node-couchdb';
import log from 'npmlog';

const couch = new NodeCouchDb();
const dbName = 'decent-news';
couch.createDatabase(dbName)
  .then(() => log.info('Database created successfully'),
  (error) => {
    if (error.code === 'EDBEXISTS') {
      log.info(`Database ${dbName} already exists.`);
    }
  });

function add(type, document) {
  return couch.uniqid()
    .then(ids => {
      return couch.insert(dbName, {
        _id: ids[0],
        type,
        ...document
      });
    });
}

const db = {
  add
};

export default db;