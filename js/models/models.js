window.Book = Backbone.Model.extend({

    urlRoot: "api/index.php/books",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.author = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a author"};
        };

    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        id: null,
        name: "",
        author: "",
    }
});

window.bookCollection = Backbone.Collection.extend({

    model: Book,

    url: "api/index.php/books"

});
window.bookSearch = Backbone.Collection.extend({
    model: Book,
    initialize : function(models, options){
        this.query = options.query;
    },
    url: function(){
        return "api/index.php/books/search/"+this.query;
    }
});
