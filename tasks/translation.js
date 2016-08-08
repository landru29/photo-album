module.exports = function(grunt) {
    "use strict";

    var xmlParser = require("node-xml-lite");

    var Translate = function(options) {
        this.gruntInstance = options.gruntInstance;
        this.keepEntities = "undefined" === typeof options.keepEntities ? true: options.keepEntities;
    };

    Translate.prototype.parsedDataToString = function(parsedData) {
        var str="";
        for (var i=0; i<parsedData.length; i++) {
            if (parsedData[i].name) {
                // get attributes
                var attrs = [];
                for (var key in parsedData[i].attrib) {
                    if (parsedData[i].attrib.hasOwnProperty(key)) {
                        attrs.push(key + "=\"" + parsedData[i].attrib[key] + "\"");
                    }
                }
                // get child nodes
                if (parsedData[i].childs) {
                    str += "<" + parsedData[i].name + " " + attrs.join(" ") + ">" + this.parsedDataToString(parsedData[i].childs) + "</" + parsedData[i].name + ">";
                } else {
                    str += "<" + parsedData[i].name + " " + attrs.join(" ") + "/>";
                }
            } else {
                // the node was a string
                str += parsedData[i];
            }
        }
        return str;
    };

    Translate.prototype.toObject = function(xmlData) {
        var obj = {};
        try {
            var parsedData = xmlParser.parseString(this.keepEntities ? xmlData.replace(/&/g, "&amp;") : xmlData);
            // first node must by 'translations'
            if ((parsedData) && (parsedData.name === "translations")) {
                for (var i=0; i<parsedData.childs.length; i++) {
                    var entry = parsedData.childs[i];
                    // the child nodes must be 'translation' and must have an attribute 'id'
                    if ((entry.name === "translation") && (entry.attrib) && (entry.attrib.id) && (entry.childs)) {
                        obj[entry.attrib.id] = this.parsedDataToString(entry.childs);
                    }
                }
            }
        } catch (e) {
            this.gruntInstance.log.error(e);
            throw e;
        }
        return obj;
    };

    Translate.prototype.xmlFileToJson = function(filePath) {
        var data = this.gruntInstance.file.read(filePath);
        var obj = this.toObject(data);
        return JSON.stringify(obj);
    };

    Translate.prototype.changeExtension = function(Filename, extension) {
        return Filename.replace(/\.xml$/, "." + extension);
    };

    grunt.registerMultiTask("translation", "Transform XML to JSON", function() {

        var self = this;
        var path = require("path");
        var translationParser = new Translate({
            gruntInstance:grunt,
            keepEntities: true
        });

        /**
         * Generate JSON translation files from XML
         */
        var task_generateTranslation = function() {
            grunt.log.subhead("Writing translations => " + self.target);
            self.files.forEach(function (d) {

                var jsonFile = translationParser.changeExtension(d.dest, "json");
                var xmlFiles = d.src;

                grunt.log.ok("Writing translation " + jsonFile);

                var str = "";
                for (var i=0; i<xmlFiles.length; i++) {
                    str += translationParser.xmlFileToJson(xmlFiles[i]);
                }

                grunt.file.write(jsonFile, str);
            });
        };

        /******************************************************/
        /**  Performing actions on files                      */
        /******************************************************/

        // translate xml to json
        task_generateTranslation();


    });
};
