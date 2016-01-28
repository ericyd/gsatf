'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('underscore');

var DataContainer = function () {
    // accepts a string

    function DataContainer(data) {
        _classCallCheck(this, DataContainer);

        this._data = data;
    }

    _createClass(DataContainer, [{
        key: 'splitRows',
        value: function splitRows() {
            if (typeof this._data != "string") {
                for (var i = 0; i < this._data.length; i++) {
                    this._data[i] = this._data[i].split('\t');
                }
            } else {
                this._data = this._data.split('\t');
            }

            return this;
        }
    }, {
        key: 'splitCols',
        value: function splitCols() {
            if (typeof this._data != "string") {
                for (var i = 0; i < this._data.length; i++) {
                    this._data[i] = this._data[i].split('\n');
                }
            } else {
                this._data = this._data.split('\n');
            }

            return this;
        }
    }, {
        key: 'data',
        get: function get() {
            return this._data;
        }
    }]);

    return DataContainer;
}();

var testData = "this\tis\ta\ttest\nthis\tis\ta\ttest\nthis\tis\ta\ttest\n";

function dataContainerTest_construct(func) {
    var expected = testData;
    var actual = new DataContainer(testData).data;

    return actual === expected;
}

function dataContainerTest_splitRows(func) {
    var expected = testData.split('\t');
    var obj = new DataContainer(testData);
    obj.splitRows().data;
    var actual = obj.data;
    return _.isEqual(expected, actual);
}

function dataContainerTest_splitCols(func) {
    var expected = testData.split('\n');
    expected.forEach(function (element, index, array) {
        array[index] = element.split('\t');
        return;
    });
    var obj = new DataContainer(testData).splitCols().splitRows();
    var actual = obj.data;
    return _.isEqual(expected, actual);
}

console.log(dataContainerTest_construct(DataContainer));
console.log(dataContainerTest_splitRows(DataContainer));
console.log(dataContainerTest_splitCols(DataContainer));