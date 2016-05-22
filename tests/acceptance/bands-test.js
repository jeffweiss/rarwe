import { test } from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';

moduleForAcceptance('Acceptance | bands');

var server;

test('List bands', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', function() {
      var response = {
        data: [
          {
            id: 1,
            type: 'bands',
            attributes: {
              name: 'Radiohead'
            }
          },
          {
            id: 2,
            type: 'bands',
            attributes: {
              name: 'Long Distance Calling'
            }
          },
        ]
      };
      return [200, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify(response)];
    });
  });

  visit('/bands');

  andThen(function() {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertLength(assert, '.band-link:contains("Radiohead")', 1, 'First bank link contains the band name');
    assertLength(assert, '.band-link:contains("Long Distance Calling")', 1, 'The other lank link contains the band name');
  });
});
test('Create a new band', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', function() {
      var response = {
        data: [
          {
            id: 1,
            type: 'bands',
            attributes: {
              name: 'Radiohead'
            }
          }
        ]
      };
      return [200, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify(response)];
    });

    this.post('/bands', function() {
      var response = {
        data: [
          {
            id: 2,
            type: 'bands',
            attributes: {
              name: 'Long Distance Calling'
            }
          }
        ]
      };
      return [200, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify(response)];
    });
  });

  visit('/bands');

  fillIn('.new-band', 'Long Distance Calling');
  click('.new-band-button');

  andThen(function() {
    assertLength(assert, '.band-link', 2, 'All band links are rendered');
    assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling', 'Created band appears at the end of the list');
    assertElement(assert, '.nav a.active:contains("Songs")', 'The Songs tab is active');
  });
});

test('Create a new song in two steps', function(assert) {
  server = new Pretender(function() {
    this.get('/bands', function() {
      var response = {
        data: [
          {
            id: 1,
            type: 'bands',
            attributes: {
              name: 'Radiohead'
            }
          }
        ]
      };
      return [200, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify(response)];
    });

    this.post('/songs', function() {
      var response = {
        data: [
          {
            id: 1,
            type: "songs",
            attributes: {
              name: 'Killer Cars'
            }
          }
        ]
      };
      return [200, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify(response)];
    });

    this.get('/bands/1/songs', () => {
      return [200, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify({ data: []})];
    });
  });

  visit('/');
  click('.band-link:contains("Radiohead")');
  click('a:contains("create one")');
  fillIn('.new-song', 'Killer Cars');
  triggerEvent('.new-song-form', 'submit');

  andThen(() => {
    assertElement(assert, '.songs .song:contains("Killer Cars")', "Creates the song and displays it in the list");
  });
});
