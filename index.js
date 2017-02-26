var async = require('async');

var DataType = function (definition) {
  this.definition = definition;
};

DataType.String = new DataType(function (val) {
  return val.constructor === String;
});

DataType.Function = new DataType(function (val) {
  return val instanceof Function;
});

DataType.Integer = new DataType(function (val) {
  return val.constructor === Number &&  val - Math.round(val) == 0;
});

DataType.Double = new DataType(function (val) {
  return val.constructor === Number;
});

DataType.Date = new DataType(function (val) {
  return val.constructor === Date;
});

DataType.Boolean = new DataType(function (val) {
  return val.constructor === Boolean;
});

DataType.Array = new DataType(function (val) {
  return val instanceof Array;
});

DataType.prototype.isValid = function (val) {
  return this.definition(val);
};

DataType.prototype.isValidCollection = function (coll) {
  var self = this;
  coll.forEach(function (elem) {
    if (!self.isValid(elem))
      return false;
  });

  return true;
};

DataType.prototype.validate = function (val, cb) {
  if (this.isValid(val)) return cb(null);
  cb(new Error('DataType validation failed for:' + val));
};

DataType.prototype.validateCollection = function (coll, cb) {
  var self = this;
  async.eachSeries(coll, function (elem, cb) {
    if (!self.isValid(elem)) return cb(new Error('DataType validation failed for:' + elem));
    cb(null);
  }, function (err) {
    if (err) return cb(err);
    cb(null);
  });
};

module.exports = DataType;
