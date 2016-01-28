var _ = require('underscore');




class DataContainer {
    // accepts a string
    constructor(data) {
        this._data = data;
    }
    
    get data() {
        return this._data;
    }
    
    splitRows() {
        if (typeof this._data != "string") {
            for (var i = 0; i < this._data.length; i++) {
                this._data[i] = this._data[i].split('\t');
            }
        } else {
            this._data = this._data.split('\t');
        }
        
        return this;
    }
    
    splitCols() {
        if (typeof this._data != "string") {
            for (var i = 0; i < this._data.length; i++) {
                this._data[i] = this._data[i].split('\n');
            }
        } else {
            this._data = this._data.split('\n');
        }
    
        return this;
    }

}





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
    expected.forEach(function(element, index, array) {
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