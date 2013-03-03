var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "list",
        "books/page/:page"	: "list",
        "books/add"         : "addbook",
        "books/:id"         : "bookDetails",
        "about"             : "about",
        "search/:query"     : "search"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },
  search: function(query) {
        var booksearch = new bookSearch([],{query: query});
        
        booksearch.fetch({success: function(){
          $("#content").html(new SearchView({model: booksearch}).el);
        }});
  },
	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var bookList = new bookCollection();
        bookList.fetch({success: function(){
            $("#content").html(new bookListView({model: bookList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    bookDetails: function (id) {
        var book = new Book({id: id});
        book.fetch({success: function(){
            $("#content").html(new bookView({model: book}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addbook: function() {
        var book = new Book();
        $('#content').html(new bookView({model: book}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HeaderView', 'bookView', 'bookListItemView', 'AboutView','SearchListItemView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
