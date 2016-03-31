angular.module('fbApp.db', []).factory('db', function() {

// Section class ###################################################
    var dataObject = function(title, content) {
        this.title = title || 'unnamed';
        this.content = content || {};
    };

    dataObject.prototype.save = function() {
        data[this.title] = this;
        saveData();
        return this;
    };

    dataObject.prototype.set = function(name, value) {
        this.content[name] = value;
        return this;
    };

    dataObject.prototype.get = function(name) {
        return this.content[name] || null;
    };

    dataObject.prototype.remove = function(name) {
        delete this.content[name];
        return this;
    };

// ################################################################

    /**
     * extract data from localStorage and convert it to right classes
     * @returns {{}}
     */
    function getData() {
        var data = {};
        var tmp = JSON.parse(localStorage.getItem('data')) || {};
        Object.keys(tmp).forEach(function(key) {
            data[key] = new dataObject(key,  tmp[key].content);
        });
        return data;
    };

    /**
     * save all data to localStorage
     */
    function saveData() {
        localStorage.setItem('data', JSON.stringify(data));
    };


    var data = getData();



    var db = {
        createSection: function(title) {
            var s = new dataObject(title, {});
            s.save();
            return s;
        },
        getSection: function(title) {
            return data[title] || null;
        },
        getOrCreateSection: function(title) {
            return data[title] ? data[title] : this.createSection(title);
        },
        getKey: function(section, key) {
            return data[section] == null ? null : data[section].get(key);
        },
        setKey: function(section, key, value) {
            return this.getOrCreateSection(section).set(key, value);
        }

    };

    return db;
});