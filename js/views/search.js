SearchView = Backbone.View.extend({ 
  initialize: function(){
    this.render(); 
  },
  render: function(){
   var books = this.model.models;
   var len = books.length;
   $(this.el).html('<ul class="resultslist" style="list-style: none;"></ul>');
   for (var i = 0; i < len; i++) {
    $('.resultslist', this.el).append(new SearchListItemView({model: books[i]}).render().el);
   }
  
   return this; 
  },
 

})
window.SearchListItemView = Backbone.View.extend({
   
      tagName: "li",
     
           className: "span3",
        
                    render: function () {
                        $(this.el).html(this.template(this.model.toJSON()));
                           return this;
                         }
                     
                       });

