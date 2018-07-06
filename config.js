'use strict'
exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 
'mongodb://admin:admin123@ds227821.mlab.com:27821/writing-center-checkin';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://admin:admin123@ds227821.mlab.com:27821/writing-center-checkin';
exports.PORT = process.env.PORT || 8080;