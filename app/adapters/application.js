import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from 'rarwe/config/environment';

export default JSONAPIAdapter.extend({
  host: ENV.apiHost,

  shouldBackgroundReloadRecord: function() {
    return false;
  }
});
