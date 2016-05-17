import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,

  actions: {
    edit: function() {
      this.set('isEditing', true);
    },
    save: function() {
      var controller = this.get('controller'),
          band = controller.get('model');

      return band.save();
    }
  }
});
