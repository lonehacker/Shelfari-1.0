window.bookListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },
 events: {
      "click input#search" : "search"
    },
search: function() {
 app.navigate("search/"+$(this.el).find('input#search_input').val(),true);
              }, 
    render: function () {
        var books = this.model.models;
        var len = books.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
       $(this.el).html(this.template);
        for (var i = startPos; i < endPos; i++) {
            $('.bookslist', this.el).append(new bookListItemView({model: books[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});

window.bookListItemView = Backbone.View.extend({

    tagName: "li",

    className: "span3",
   
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
